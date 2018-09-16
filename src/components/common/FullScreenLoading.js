import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export const FullScreenLoading = ({ text, size }) => (
  <View style={styles.centerItems}>
    <Text>{text || 'Loading...'}</Text>
    <ActivityIndicator size={size || 'large'} />
  </View>
);

FullScreenLoading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
