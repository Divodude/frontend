import type {MediaStream} from '../utils/webrtc';

export interface User {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  from: string;
  fromName: string;
  text: string;
  timestamp: number;
  mine: boolean;
}

export type TabName = 'people' | 'friends';

export type Route =
  | {name: 'Auth'}
  | {name: 'Home'; tab: TabName}
  | {name: 'Chat'; friendId: string}
  | {name: 'Call'};

export interface RegisterPayload {
  id: string;
  name: string;
  username: string;
  password: string;
}

export interface AppState {
  connected: boolean;
  token: string;
  myId: string;
  myName: string;
  route: Route;
  onlineUsers: User[];
  friends: Record<string, User>;
  sentRequests: Set<string>;
  pendingRequests: Record<string, User>;
  chats: Record<string, Message[]>;
  activeChatId: string | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  calling: boolean;
  callTarget: User | null;
}

export interface AppActions {
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  navigateToTab: (tab: TabName) => void;
  openChat: (friendId: string) => void;
  goBackFromChat: () => void;
  sendFriendRequest: (user: User) => void;
  acceptRequest: (user: User) => void;
  rejectRequest: (user: User) => void;
  sendChatMessage: (friendId: string, text: string) => void;
  startCall: (user: User) => Promise<void>;
  hangup: () => void;
  switchCamera: () => void;
}
