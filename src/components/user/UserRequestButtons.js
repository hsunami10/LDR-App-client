import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { ClickableImage } from '../../components/common';
import RedX from '../../assets/images/red_x.png';
import GreenV from '../../assets/images/green_check.png';

const UserRequestButtons = ({ onAcceptPress, onRejectPress }) => (
  <View style={styles.viewStyle}>
   <ClickableImage
     width={30}
     height={30}
     image={RedX}
     type="opacity"
     onPress={onRejectPress}
   />
   <ClickableImage
     width={30}
     height={30}
     image={GreenV}
     type="opacity"
     onPress={onAcceptPress}
   />
  </View>
);

UserRequestButtons.propTypes = {
  onAcceptPress: PropTypes.func.isRequired,
  onRejectPress: PropTypes.func.isRequired,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 0,
  }
});

export default UserRequestButtons;
