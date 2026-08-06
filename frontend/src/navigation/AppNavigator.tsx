import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

import {AppHeader} from '../components/AppHeader';
import {BottomTabBar} from '../components/BottomTabBar';
import {useAppContext} from '../context/AppContext';
import {AuthScreen} from '../screens/AuthScreen';
import {CallScreen} from '../screens/CallScreen';
import {ChatScreen} from '../screens/ChatScreen';
import {FriendsScreen} from '../screens/FriendsScreen';
import {PeopleScreen} from '../screens/PeopleScreen';
import {styles} from '../styles/appStyles';

export const AppNavigator = () => {
  const {
    state: {route},
  } = useAppContext();

  if (route.name === 'Auth') {
    return (
      <View style={styles.authRoot}>
        <AuthScreen />
      </View>
    );
  }

  if (route.name === 'Call') {
    return <CallScreen />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      {route.name !== 'Chat' && <AppHeader />}

      <View style={styles.content}>
        {route.name === 'Chat' ? (
          <ChatScreen />
        ) : route.tab === 'people' ? (
          <PeopleScreen />
        ) : (
          <FriendsScreen />
        )}
      </View>

      {route.name === 'Home' && <BottomTabBar activeTab={route.tab} />}
    </SafeAreaView>
  );
};
