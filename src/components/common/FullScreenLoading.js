import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';

// NOTE: Use this if you do not want the whole screen disabled when loading
export const FullScreenLoading = ({ text, size, visible, style, width, height }) => (
  <View
    style={[styles.centerItems, {
      display: visible ? 'flex' : 'none',
      width: width || Dimensions.get('window').width,
      height: height || Dimensions.get('window').height
    }, style || {}]}
  >
    {text ? <Text>{text}</Text> : null}
    <ActivityIndicator size={size || 'large'} />
  </View>
);

FullScreenLoading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  style: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
