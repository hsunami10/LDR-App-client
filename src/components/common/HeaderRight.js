import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MIN_HEADER_HEIGHT_NO_STATUS_BAR } from '../../constants/variables';

export const HeaderRight = props => (
  <View style={styles.rightContainerStyle}>
    <TouchableOpacity
      onPress={props.onRightPress}
      disabled={props.disableRight}
    >
      {props.headerRight || <Text style={styles.rightTextStyle}>{props.rightTitle || 'Submit'}</Text>}
    </TouchableOpacity>
  </View>
);

HeaderRight.propTypes = {
  onRightPress: PropTypes.func,
  rightTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  headerRight: PropTypes.element,
  disableRight: PropTypes.bool,
};

const styles = StyleSheet.create({
  rightContainerStyle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: MIN_HEADER_HEIGHT_NO_STATUS_BAR
  },
  rightTextStyle: {
    color: '#007aff',
    fontSize: 16
  }
});
