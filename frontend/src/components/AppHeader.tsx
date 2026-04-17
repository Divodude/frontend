import React from 'react';
import {Text, View} from 'react-native';

import {useAppContext} from '../context/AppContext';
import {styles} from '../styles/appStyles';

export const AppHeader = () => {
  const {
    state: {myId, myName},
  } = useAppContext();

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Connecta</Text>
        <Text style={styles.headerSubtitle}>Realtime social calling</Text>
      </View>
      <View style={styles.headerBadge}>
        <View style={styles.onlineDot} />
        <Text style={styles.headerBadgeText}>{myName || myId}</Text>
      </View>
    </View>
  );
};
