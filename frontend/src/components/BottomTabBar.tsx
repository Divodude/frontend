import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import {useAppContext} from '../context/AppContext';
import type {TabName} from '../types/app';
import {styles} from '../styles/appStyles';

interface BottomTabBarProps {
  activeTab: TabName;
}

export const BottomTabBar = ({activeTab}: BottomTabBarProps) => {
  const {
    state: {pendingRequests},
    actions: {navigateToTab},
  } = useAppContext();

  const pendingCount = Object.keys(pendingRequests).length;

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigateToTab('people')}
          style={[styles.tabItem, activeTab === 'people' && styles.tabItemActive]}>
          <Text style={[styles.tabLabel, activeTab === 'people' && styles.tabLabelActive]}>
            Explore
          </Text>
          {pendingCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{pendingCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigateToTab('friends')}
          style={[styles.tabItem, activeTab === 'friends' && styles.tabItemActive]}>
          <Text style={[styles.tabLabel, activeTab === 'friends' && styles.tabLabelActive]}>
            Friends
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
