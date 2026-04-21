import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {Avatar} from '../components/Avatar';
import {useAppContext} from '../context/AppContext';
import {styles} from '../styles/appStyles';

export const PeopleScreen = () => {
  const {
    state: {friends, onlineUsers, pendingRequests, sentRequests},
    actions: {acceptRequest, rejectRequest, sendFriendRequest},
  } = useAppContext();

  const pending = Object.values(pendingRequests);
  const availableUsers = onlineUsers.filter(user => !friends[user.id]);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.screenContainer}>
      {pending.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Friend requests</Text>
          {pending.map(user => (
            <View key={user.id} style={styles.cardRow}>
              <Avatar name={user.name} />
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>{user.name}</Text>
                <Text style={styles.cardSubtitle}>@{user.id}</Text>
              </View>
              <View style={styles.inlineActions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => acceptRequest(user)}
                  style={[styles.smallButton, styles.acceptButton]}>
                  <Text style={styles.smallButtonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => rejectRequest(user)}
                  style={[styles.smallButton, styles.rejectButton]}>
                  <Text style={styles.smallButtonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Online users</Text>
        {availableUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No one else is online right now.</Text>
            <Text style={styles.emptySubtitle}>
              When another user connects, they will appear here.
            </Text>
          </View>
        ) : (
          availableUsers.map(user => {
            const sent = sentRequests.has(user.id);

            return (
              <View key={user.id} style={styles.cardRow}>
                <Avatar name={user.name} />
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{user.name}</Text>
                  <Text style={styles.cardSubtitle}>@{user.id}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={sent}
                  onPress={() => sendFriendRequest(user)}
                  style={[styles.pillButton, sent && styles.disabledPillButton]}>
                  <Text style={[styles.pillButtonText, sent && styles.disabledPillText]}>
                    {sent ? 'Sent' : 'Add friend'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
};
