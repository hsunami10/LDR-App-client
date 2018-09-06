import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import general from '../../constants/styles/general';

export const FullScreenLoading = ({ text, size }) => (
  <View style={general.centerItems}>
    <Text>{text || 'Loading...'}</Text>
    <ActivityIndicator size={size || 'large'} />
  </View>
);
