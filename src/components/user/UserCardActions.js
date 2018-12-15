import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import ActionButton from './ActionButton';

const UserCardActions = ({ user, onActionPress, onRequestPress }) => (
  <View style={styles.viewStyle}>
    <ActionButton
      id={user.id}
      type={user.type}
      onPress={onActionPress}
      onRequestPress={onRequestPress}
    />
  </View>
);

UserCardActions.propTypes = {
  user: PropTypes.object.isRequired,
  onActionPress: PropTypes.func.isRequired,
  onRequestPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default UserCardActions;
