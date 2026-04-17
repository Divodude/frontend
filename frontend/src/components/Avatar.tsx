import React from 'react';
import {Text, View, ViewStyle} from 'react-native';

import {styles} from '../styles/appStyles';

interface AvatarProps {
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar = ({name, size = 44, style}: AvatarProps) => {
  return (
    <View
      style={[
        styles.avatar,
        {width: size, height: size, borderRadius: size / 2},
        style,
      ]}>
      <Text style={[styles.avatarText, {fontSize: size * 0.38}]}>
        {(name || '?').charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};
