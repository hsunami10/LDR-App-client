import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { HeaderBackButton } from 'react-navigation';
import { MIN_HEADER_HEIGHT_NO_STATUS_BAR } from '../../constants/variables';

export const HeaderLeft = props => (
  <View style={styles.leftContainerStyle}>
    {props.headerLeft ||
      <HeaderBackButton
        title={props.leftTitle || null}
        onPress={props.onLeftPress}
      />
    }
  </View>
);

HeaderLeft.propTypes = {
  leftTitle: PropTypes.string,
  onLeftPress: PropTypes.func,
  headerLeft: PropTypes.element
};

const styles = StyleSheet.create({
  leftContainerStyle: {
    position: 'absolute',
    alignSelf: 'flex-start',
    height: MIN_HEADER_HEIGHT_NO_STATUS_BAR
  }
});
