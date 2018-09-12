import React from 'react';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

export const SpinnerOverlay = props => (
  <View style={{ flex: 1 }}>
    <Spinner
      cancelable={props.cancelable}
      color={props.color}
      animation={props.animation}
      overlayColor={props.overlayColor}
      size={props.size}
      textContent={props.textContent}
      textStyle={props.textStyle}
      visible={props.visible}
    >
      {props.children}
    </Spinner>
  </View>
);
