import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { MIN_HEADER_HEIGHT_NO_STATUS_BAR } from '../../constants/variables';

export const HeaderLeft = props => (
  <View style={styles.leftContainerStyle}>
    <HeaderBackButton
      title={props.headerLeft || props.leftTitle}
      onPress={props.onLeftPress}
      disabled={props.disableLeft}
    />
  </View>
);

HeaderLeft.propTypes = {
  leftTitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]),
  onLeftPress: PropTypes.func,
  headerLeft: PropTypes.element,
  disableLeft: PropTypes.bool
};

const styles = StyleSheet.create({
  leftContainerStyle: {
    position: 'absolute',
    alignSelf: 'flex-start',
    height: MIN_HEADER_HEIGHT_NO_STATUS_BAR
  }
});
