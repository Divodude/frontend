import React from 'react';
import {StatusBar, Text, TouchableOpacity, View} from 'react-native';
import {RTCView} from '../utils/webrtc';

import {Avatar} from '../components/Avatar';
import {useAppContext} from '../context/AppContext';
import {styles} from '../styles/appStyles';

export const CallScreen = () => {
  const {
    state: {callTarget, localStream, remoteStream},
    actions: {hangup, switchCamera},
  } = useAppContext();

  return (
    <View style={styles.callScreen}>
      <StatusBar barStyle="light-content" />

      {remoteStream ? (
        <RTCView objectFit="cover" streamURL={remoteStream.toURL()} style={styles.remoteVideo} />
      ) : (
        <View style={styles.callWaitingState}>
          <Avatar name={callTarget?.name} size={96} />
          <Text style={styles.callTitle}>{callTarget?.name}</Text>
          <Text style={styles.callSubtitle}>Connecting the call...</Text>
        </View>
      )}

      {localStream && (
        <View style={styles.localPreviewShell}>
          <RTCView
            objectFit="cover"
            streamURL={localStream.toURL()}
            style={styles.localPreview}
            zOrder={1}
          />
        </View>
      )}

      <View style={styles.callActions}>
        <TouchableOpacity activeOpacity={0.8} onPress={switchCamera} style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Switch</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={hangup}
          style={[styles.smallButton, styles.rejectButton]}>
          <Text style={styles.smallButtonText}>Hang up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
