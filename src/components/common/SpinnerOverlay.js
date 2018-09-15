import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export const SpinnerOverlay = props => (
  <View style={{ flex: 1 }}>
    <Spinner
      cancelable={props.cancelable}
      color={props.color || 'black'}
      animation={props.animation}
      overlayColor={props.overlayColor}
      size={props.size}
      textContent={props.text}
      textStyle={props.textStyle}
      visible={props.visible}
    >
      {props.children}
    </Spinner>
  </View>
);

SpinnerOverlay.propTypes = {
  cancelable: PropTypes.bool,
  color: PropTypes.string,
  animation: PropTypes.string,
  overlayColor: PropTypes.string,
  size: PropTypes.string,
  text: PropTypes.string,
  textStyle: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ])
};
