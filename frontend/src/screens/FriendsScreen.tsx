import React from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {Avatar} from '../components/Avatar';
import {useAppContext} from '../context/AppContext';
import {styles} from '../styles/appStyles';

export const FriendsScreen = () => {
  const {
    state: {friends},
    actions: {openChat, startCall},
  } = useAppContext();

  const friendList = Object.values(friends);

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={styles.screenContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My friends</Text>
        {friendList.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Your friends list is empty.</Text>
            <Text style={styles.emptySubtitle}>
              Add people from the Explore tab to start chatting.
            </Text>
          </View>
        ) : (
          friendList.map(user => (
            <View key={user.id} style={styles.cardRow}>
              <Avatar name={user.name} />
              <View style={styles.cardCopy}>
                <Text style={styles.cardTitle}>{user.name}</Text>
                <Text style={styles.cardSubtitle}>@{user.id}</Text>
              </View>
              <View style={styles.inlineActions}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openChat(user.id)}
                  style={styles.smallButton}>
                  <Text style={styles.smallButtonText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => void startCall(user)}
                  style={[styles.smallButton, styles.videoButton]}>
                  <Text style={styles.smallButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};
