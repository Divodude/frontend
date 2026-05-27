import 'react-native-get-random-values';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
import {
  MediaStream,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
} from '../utils/webrtc';

import {API_URL, WS_BASE} from '../../config';
import type {
  AppActions,
  AppState,
  Message,
  RegisterPayload,
  Route,
  TabName,
  User,
} from '../types/app';

type Action =
  | {type: 'login_success'; payload: {token: string; myId: string; myName: string}}
  | {type: 'set_connection'; payload: boolean}
  | {type: 'set_route'; payload: Route}
  | {type: 'set_online_users'; payload: User[]}
  | {type: 'add_pending_request'; payload: User}
  | {type: 'mark_request_sent'; payload: string}
  | {type: 'remove_sent_request'; payload: string}
  | {type: 'accept_friend_local'; payload: User}
  | {type: 'remove_pending_request'; payload: string}
  | {type: 'set_active_chat'; payload: string | null}
  | {type: 'append_chat'; payload: {friendId: string; message: Message}}
  | {type: 'set_local_stream'; payload: MediaStream | null}
  | {type: 'start_call'; payload: User}
  | {type: 'set_remote_stream'; payload: MediaStream | null}
  | {type: 'end_call'};

const initialState: AppState = {
  connected: false,
  token: '',
  myId: '',
  myName: '',
  route: {name: 'Auth'},
  onlineUsers: [],
  friends: {},
  sentRequests: new Set<string>(),
  pendingRequests: {},
  chats: {},
  activeChatId: null,
  localStream: null,
  remoteStream: null,
  calling: false,
  callTarget: null,
};

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'login_success':
      return {
        ...state,
        token: action.payload.token,
        myId: action.payload.myId,
        myName: action.payload.myName,
      };
    case 'set_connection':
      return {...state, connected: action.payload};
    case 'set_route':
      return {...state, route: action.payload};
    case 'set_online_users':
      return {...state, onlineUsers: action.payload};
    case 'add_pending_request':
      return {
        ...state,
        pendingRequests: {
          ...state.pendingRequests,
          [action.payload.id]: action.payload,
        },
      };
    case 'mark_request_sent': {
      const next = new Set(state.sentRequests);
      next.add(action.payload);
      return {...state, sentRequests: next};
    }
    case 'remove_sent_request': {
      const next = new Set(state.sentRequests);
      next.delete(action.payload);
      return {...state, sentRequests: next};
    }
    case 'accept_friend_local': {
      const nextPending = {...state.pendingRequests};
      delete nextPending[action.payload.id];
      return {
        ...state,
        friends: {...state.friends, [action.payload.id]: action.payload},
        pendingRequests: nextPending,
      };
    }
    case 'remove_pending_request': {
      const nextPending = {...state.pendingRequests};
      delete nextPending[action.payload];
      return {...state, pendingRequests: nextPending};
    }
    case 'set_active_chat':
      return {...state, activeChatId: action.payload};
    case 'append_chat':
      return {
        ...state,
        chats: {
          ...state.chats,
          [action.payload.friendId]: [
            ...(state.chats[action.payload.friendId] || []),
            action.payload.message,
          ],
        },
      };
    case 'set_local_stream':
      return {...state, localStream: action.payload};
    case 'start_call':
      return {
        ...state,
        calling: true,
        callTarget: action.payload,
        route: {name: 'Call'},
      };
    case 'set_remote_stream':
      return {...state, remoteStream: action.payload};
    case 'end_call':
      return {
        ...state,
        remoteStream: null,
        calling: false,
        callTarget: null,
      };
    default:
      return state;
  }
};

const AppContext = createContext<{state: AppState; actions: AppActions} | null>(null);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const myIdRef = useRef(state.myId);
  const myNameRef = useRef(state.myName);
  const routeRef = useRef(state.route);
  const localStreamRef = useRef<MediaStream | null>(state.localStream);
  const remoteStreamRef = useRef<MediaStream | null>(state.remoteStream);
  const pendingCandidatesRef = useRef<any[]>([]);

  useEffect(() => {
    myIdRef.current = state.myId;
  }, [state.myId]);

  useEffect(() => {
    myNameRef.current = state.myName;
  }, [state.myName]);

  useEffect(() => {
    routeRef.current = state.route;
  }, [state.route]);

  useEffect(() => {
    localStreamRef.current = state.localStream;
  }, [state.localStream]);

  useEffect(() => {
    remoteStreamRef.current = state.remoteStream;
  }, [state.remoteStream]);

  const closePeerConnection = useCallback(() => {
    pendingCandidatesRef.current = [];
    pcRef.current?.close();
    pcRef.current = null;
  }, []);

  const cleanupStreams = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    remoteStreamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  const sendSignal = useCallback((message: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          ...message,
          from: myIdRef.current,
          fromName: myNameRef.current,
        }),
      );
    }
  }, []);

  const flushPendingCandidates = useCallback(async () => {
    if (!pcRef.current || !pcRef.current.remoteDescription) {
      return;
    }

    while (pendingCandidatesRef.current.length > 0) {
      const candidate = pendingCandidatesRef.current.shift();
      if (candidate) {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    }
  }, []);

  const setupPeerConnection = useCallback(
    (targetId: string) => {
      closePeerConnection();

      const peerConnection = new RTCPeerConnection({
        iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
      });

      const currentStream = localStreamRef.current;
      if (currentStream) {
        currentStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, currentStream);
        });
      }

      peerConnection.addEventListener('icecandidate', event => {
        if (event.candidate) {
          sendSignal({
            type: 'candidate',
            target: targetId,
            candidate: event.candidate,
          });
        }
      });

      peerConnection.addEventListener('track', event => {
        if (event.streams?.[0]) {
          dispatch({type: 'set_remote_stream', payload: event.streams[0]});
        }
      });

      peerConnection.addEventListener('connectionstatechange', () => {
        if (
          peerConnection.connectionState === 'failed' ||
          peerConnection.connectionState === 'disconnected'
        ) {
          closePeerConnection();
          dispatch({type: 'end_call'});
          dispatch({type: 'set_route', payload: {name: 'Home', tab: 'friends'}});
        }
      });

      pcRef.current = peerConnection;
    },
    [closePeerConnection, sendSignal],
  );

  const startLocalStream = useCallback(async () => {
    if (localStreamRef.current) {
      return;
    }

    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 640,
          height: 480,
          frameRate: 30,
          facingMode: 'user',
        },
      });
      dispatch({type: 'set_local_stream', payload: stream});
    } catch (error) {
      console.error('Failed to get local stream', error);
    }
  }, []);

  const requestPermissions = useCallback(async () => {
    if (Platform.OS !== 'android') {
      await startLocalStream();
      return;
    }

    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ];

      if (Platform.Version >= 31) {
        permissions.push(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT);
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const audioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
        PermissionsAndroid.RESULTS.GRANTED;
      const bluetoothGranted =
        Platform.Version < 31 ||
        granted[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT] ===
          PermissionsAndroid.RESULTS.GRANTED;

      if (cameraGranted && audioGranted && bluetoothGranted) {
        await startLocalStream();
      } else {
        Alert.alert(
          'Permissions required',
          'Camera, microphone, and Bluetooth permissions are needed.',
        );
      }
    } catch (error) {
      console.warn('Permission error', error);
    }
  }, [startLocalStream]);

  const hangup = useCallback(() => {
    closePeerConnection();
    dispatch({type: 'end_call'});

    if (routeRef.current.name === 'Call') {
      dispatch({type: 'set_route', payload: {name: 'Home', tab: 'friends'}});
    }
  }, [closePeerConnection]);

  const handleOffer = useCallback(
    async (message: any) => {
      const caller: User = {id: message.from, name: message.fromName};
      dispatch({type: 'start_call', payload: caller});
      setupPeerConnection(message.from);

      try {
        await pcRef.current?.setRemoteDescription(
          new RTCSessionDescription(message.offer),
        );
        await flushPendingCandidates();
        const answer = await pcRef.current?.createAnswer();
        await pcRef.current?.setLocalDescription(answer);
        sendSignal({type: 'answer', target: message.from, answer});
      } catch (error) {
        console.error('Answer error', error);
      }
    },
    [flushPendingCandidates, sendSignal, setupPeerConnection],
  );

  const handleAnswer = useCallback(
    async (message: any) => {
      try {
        await pcRef.current?.setRemoteDescription(
          new RTCSessionDescription(message.answer),
        );
        await flushPendingCandidates();
      } catch (error) {
        console.error('Set remote description error', error);
      }
    },
    [flushPendingCandidates],
  );

  const handleCandidate = useCallback(async (message: any) => {
    try {
      if (!pcRef.current) {
        pendingCandidatesRef.current.push(message.candidate);
        return;
      }

      if (!pcRef.current.remoteDescription) {
        pendingCandidatesRef.current.push(message.candidate);
        return;
      }

      await pcRef.current.addIceCandidate(new RTCIceCandidate(message.candidate));
    } catch (error) {
      console.error('ICE candidate error', error);
    }
  }, []);

  const handleIncoming = useCallback(
    (message: any) => {
      switch (message.type) {
        case 'online_users': {
          const others = (message.users as User[]).filter(
            user => user.id !== myIdRef.current,
          );
          dispatch({type: 'set_online_users', payload: others});
          break;
        }
        case 'friend_request':
          dispatch({
            type: 'add_pending_request',
            payload: {id: message.from, name: message.fromName},
          });
          break;
        case 'friend_accept':
          dispatch({
            type: 'accept_friend_local',
            payload: {id: message.from, name: message.fromName},
          });
          dispatch({type: 'remove_sent_request', payload: message.from});
          break;
        case 'friend_reject':
          dispatch({type: 'remove_sent_request', payload: message.from});
          Alert.alert('Friend Request', `${message.fromName} declined your request.`);
          break;
        case 'chat':
          dispatch({
            type: 'append_chat',
            payload: {
              friendId: message.from,
              message: {
                id: `${Date.now()}-${message.from}`,
                from: message.from,
                fromName: message.fromName,
                text: message.text,
                timestamp: message.timestamp,
                mine: false,
              },
            },
          });
          break;
        case 'offer':
          void handleOffer(message);
          break;
        case 'answer':
          void handleAnswer(message);
          break;
        case 'candidate':
          void handleCandidate(message);
          break;
      }
    },
    [handleAnswer, handleCandidate, handleOffer],
  );

  const connect = useCallback(
    (userToken: string) => {
      wsRef.current?.close();

      const url = `${WS_BASE}/${userToken}`;
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        dispatch({type: 'set_connection', payload: true});
        dispatch({type: 'set_route', payload: {name: 'Home', tab: 'people'}});
      };

      wsRef.current.onmessage = event => {
        try {
          handleIncoming(JSON.parse(event.data));
        } catch (error) {
          console.error('WS parse error', error);
        }
      };

      wsRef.current.onerror = () => {
        Alert.alert('Connection Error', 'Could not reach server.');
        dispatch({type: 'set_connection', payload: false});
      };

      wsRef.current.onclose = () => {
        dispatch({type: 'set_connection', payload: false});
        dispatch({type: 'set_route', payload: {name: 'Auth'}});
      };
    },
    [handleIncoming],
  );

  useEffect(() => {
    void requestPermissions();

    return () => {
      closePeerConnection();
      wsRef.current?.close();
      cleanupStreams();
    };
  }, [cleanupStreams, closePeerConnection, requestPermissions]);

  const login = useCallback(
    async (username: string, password: string) => {
      if (!username || !password) {
        return;
      }

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({username, password}),
        });
        const data = await response.json();

        if (!response.ok) {
          Alert.alert('Login Failed', data.detail || 'Check your credentials.');
          return;
        }

        dispatch({
          type: 'login_success',
          payload: {
            token: data.access_token,
            myId: username,
            myName: username.toUpperCase(),
          },
        });
        connect(data.access_token);
      } catch (error) {
        Alert.alert('Error', 'Could not connect to server.');
      }
    },
    [connect],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Registration Failed', data.detail || 'Please try again.');
        return false;
      }

      Alert.alert('Success', 'Profile created. You can log in now.');
      return true;
    } catch (error) {
      Alert.alert('Error', 'Could not connect to server.');
      return false;
    }
  }, []);

  const navigateToTab = useCallback((tab: TabName) => {
    dispatch({type: 'set_route', payload: {name: 'Home', tab}});
  }, []);

  const openChat = useCallback((friendId: string) => {
    dispatch({type: 'set_active_chat', payload: friendId});
    dispatch({type: 'set_route', payload: {name: 'Chat', friendId}});
  }, []);

  const goBackFromChat = useCallback(() => {
    dispatch({type: 'set_route', payload: {name: 'Home', tab: 'friends'}});
  }, []);

  const sendFriendRequest = useCallback(
    (user: User) => {
      sendSignal({type: 'friend_request', target: user.id});
      dispatch({type: 'mark_request_sent', payload: user.id});
    },
    [sendSignal],
  );

  const acceptRequest = useCallback(
    (user: User) => {
      sendSignal({type: 'friend_accept', target: user.id});
      dispatch({type: 'accept_friend_local', payload: user});
    },
    [sendSignal],
  );

  const rejectRequest = useCallback(
    (user: User) => {
      sendSignal({type: 'friend_reject', target: user.id});
      dispatch({type: 'remove_pending_request', payload: user.id});
    },
    [sendSignal],
  );

  const sendChatMessage = useCallback(
    (friendId: string, text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      const message: Message = {
        id: `${Date.now()}-me`,
        from: myIdRef.current,
        fromName: myNameRef.current,
        text: trimmed,
        timestamp: Date.now(),
        mine: true,
      };

      sendSignal({
        type: 'chat',
        target: friendId,
        text: trimmed,
        timestamp: message.timestamp,
      });

      dispatch({
        type: 'append_chat',
        payload: {friendId, message},
      });
    },
    [sendSignal],
  );

  const startCall = useCallback(
    async (user: User) => {
      if (!localStreamRef.current) {
        Alert.alert('Camera not ready', 'The local media stream is not available yet.');
        return;
      }

      dispatch({type: 'start_call', payload: user});
      setupPeerConnection(user.id);

      try {
        const offer = await pcRef.current?.createOffer();
        await pcRef.current?.setLocalDescription(offer);
        sendSignal({type: 'offer', target: user.id, offer});
      } catch (error) {
        console.error('Offer error', error);
        hangup();
      }
    },
    [hangup, sendSignal, setupPeerConnection],
  );

  const switchCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach(track => {
      const maybeSwitch = (track as any)._switchCamera;
      if (typeof maybeSwitch === 'function') {
        maybeSwitch.call(track);
      }
    });
  }, []);

  const actions = useMemo<AppActions>(
    () => ({
      login,
      register,
      navigateToTab,
      openChat,
      goBackFromChat,
      sendFriendRequest,
      acceptRequest,
      rejectRequest,
      sendChatMessage,
      startCall,
      hangup,
      switchCamera,
    }),
    [
      acceptRequest,
      goBackFromChat,
      hangup,
      login,
      navigateToTab,
      openChat,
      register,
      rejectRequest,
      sendChatMessage,
      sendFriendRequest,
      startCall,
      switchCamera,
    ],
  );

  const value = useMemo(() => ({state, actions}), [actions, state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }

  return context;
};
