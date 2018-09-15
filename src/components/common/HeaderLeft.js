import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MIN_HEADER_HEIGHT } from '../../constants/variables';

export const HeaderLeft = props => (
  <View style={styles.leftContainerStyle}>
    <HeaderBackButton
      title={props.leftTitle || null}
      onPress={props.onPressLeft}
    />
  </View>
);

HeaderLeft.propTypes = {
  leftTitle: PropTypes.string,
  onPressLeft: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  leftContainerStyle: {
    position: 'absolute',
    alignSelf: 'flex-start',
    height: MIN_HEADER_HEIGHT - getStatusBarHeight(true), // Default header height, no status bar
  }
});
