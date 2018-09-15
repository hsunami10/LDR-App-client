import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MIN_HEADER_HEIGHT } from '../../constants/variables';

export const HeaderRight = props => (
  <View style={styles.rightContainerStyle}>
    {props.headerRight ||
      <TouchableOpacity onPress={props.onPressRight}>
        <Text style={styles.rightTextStyle}>{props.rightTitle || 'Submit'}</Text>
      </TouchableOpacity>
    }
  </View>
);

HeaderRight.propTypes = {
  onPressRight: PropTypes.func.isRequired,
  rightTitle: PropTypes.string,
  headerRight: PropTypes.element
};

const styles = StyleSheet.create({
  rightContainerStyle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: MIN_HEADER_HEIGHT - getStatusBarHeight(true)
  },
  rightTextStyle: {
    color: '#007aff',
    fontSize: 16
  }
});
