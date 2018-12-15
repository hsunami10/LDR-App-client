import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import UserCardHeader from './UserCardHeader';
import UserCardActions from './UserCardActions';

const UserCard = ({ user, onActionPress, onRequestPress, onUserPress }) => (
  <TouchableHighlight
    onPress={() => onUserPress(user.id, user.username)}
    underlayColor="rgba(0,0,0,0.3)"
  >
    <View style={styles.cardContainerStyle}>
      <UserCardHeader
        user={user}
        onActionPress={onActionPress}
        onRequestPress={onRequestPress}
      />
      <UserCardActions
        user={user}
        onActionPress={onActionPress}
        onRequestPress={onRequestPress}
      />
    </View>
  </TouchableHighlight>
);

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  onUserPress: PropTypes.func.isRequired,
  onActionPress: PropTypes.func.isRequired,
  onRequestPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  cardContainerStyle: {
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
  }
});

export default UserCard;
