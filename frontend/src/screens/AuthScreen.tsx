import React, {useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useAppContext} from '../context/AppContext';
import {styles} from '../styles/appStyles';

export const AuthScreen = () => {
  const {actions} = useAppContext();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regId, setRegId] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    try {
      await actions.login(loginUsername, loginPassword);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regName || !regId || !regUsername || !regPassword) {
      return;
    }

    setLoading(true);
    try {
      const didRegister = await actions.register({
        id: regId,
        name: regName,
        username: regUsername,
        password: regPassword,
      });

      if (didRegister) {
        setMode('login');
        setLoginUsername(regUsername);
        setLoginPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.authScreen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.authCard}>
        <View style={styles.authHeader}>
          <Text style={styles.authTitle}>Connecta</Text>
          <Text style={styles.authSubtitle}>
            Sign in to chat, connect, and start video calls.
          </Text>
        </View>

        {mode === 'login' ? (
          <>
            <TextInput
              autoCapitalize="none"
              onChangeText={setLoginUsername}
              placeholder="Username"
              placeholderTextColor="#64748B"
              selectionColor="#6366F1"
              style={styles.input}
              value={loginUsername}
            />
            <TextInput
              onChangeText={setLoginPassword}
              placeholder="Password"
              placeholderTextColor="#64748B"
              secureTextEntry
              selectionColor="#6366F1"
              style={styles.input}
              value={loginPassword}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleLogin}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {loading ? 'Logging in...' : 'Log in'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setMode('register')}
              style={styles.linkButton}>
              <Text style={styles.linkText}>Create an account</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              onChangeText={setRegName}
              placeholder="Display name"
              placeholderTextColor="#64748B"
              selectionColor="#6366F1"
              style={styles.input}
              value={regName}
            />
            <TextInput
              autoCapitalize="none"
              onChangeText={setRegId}
              placeholder="Unique ID"
              placeholderTextColor="#64748B"
              selectionColor="#6366F1"
              style={styles.input}
              value={regId}
            />
            <TextInput
              autoCapitalize="none"
              onChangeText={setRegUsername}
              placeholder="Username"
              placeholderTextColor="#64748B"
              selectionColor="#6366F1"
              style={styles.input}
              value={regUsername}
            />
            <TextInput
              onChangeText={setRegPassword}
              placeholder="Password"
              placeholderTextColor="#64748B"
              secureTextEntry
              selectionColor="#6366F1"
              style={styles.input}
              value={regPassword}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleRegister}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>
                {loading ? 'Creating...' : 'Sign up'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setMode('login')}
              style={styles.linkButton}>
              <Text style={styles.linkText}>Already have an account?</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
