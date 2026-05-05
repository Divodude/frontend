import React, {useMemo, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Avatar} from '../components/Avatar';
import {useAppContext} from '../context/AppContext';
import {styles} from '../styles/appStyles';

export const ChatScreen = () => {
  const {
    state: {activeChatId, chats, friends},
    actions: {goBackFromChat, sendChatMessage, startCall},
  } = useAppContext();
  const [input, setInput] = useState('');

  const friend = activeChatId ? friends[activeChatId] : null;
  const messages = useMemo(
    () => (activeChatId ? chats[activeChatId] || [] : []),
    [activeChatId, chats],
  );

  const handleSend = () => {
    if (!activeChatId) {
      return;
    }

    sendChatMessage(activeChatId, input);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.chatScreen}>
      <View style={styles.chatHeader}>
        <TouchableOpacity activeOpacity={0.8} onPress={goBackFromChat} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Avatar name={friend?.name} size={36} />
        <View style={styles.chatHeaderCopy}>
          <Text style={styles.chatHeaderTitle}>{friend?.name || activeChatId}</Text>
          <Text style={styles.chatHeaderSubtitle}>Direct messages</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => friend && void startCall(friend)}
          style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Call</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={styles.chatList}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={[
              styles.messageRow,
              item.mine ? styles.messageRowMine : styles.messageRowTheirs,
            ]}>
            <View style={[styles.messageBubble, item.mine && styles.messageBubbleMine]}>
              <Text style={[styles.messageText, item.mine && styles.messageTextMine]}>
                {item.text}
              </Text>
            </View>
            <Text style={styles.messageTimestamp}>
              {new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      />

      <View style={styles.chatComposer}>
        <TextInput
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          placeholder="Type a message"
          placeholderTextColor="#94A3B8"
          returnKeyType="send"
          selectionColor="#6366F1"
          style={styles.chatInput}
          value={input}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!input.trim()}
          onPress={handleSend}
          style={[styles.pillButton, !input.trim() && styles.disabledPillButton]}>
          <Text style={[styles.pillButtonText, !input.trim() && styles.disabledPillText]}>
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
