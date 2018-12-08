import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage } from '../common';
import FriendButton from './FriendButton';

const UserCard = ({ user, onUserPress, onFriendPress }) => {
  console.log('user', user);
  return (
    <TouchableHighlight
      onPress={onUserPress}
      underlayColor="rgba(0,0,0,0.3)"
    >
      <View style={styles.cardContainerStyle}>
        <ClickableImage
          width={40}
          height={40}
          type="none"
          onPress={() => null}
          image={user.profile_pic ? `${ROOT_URL}/${user.profile_pic}` : null}
        />

        <View style={styles.textViewStyle}>
          <Text
            style={{ fontWeight: 'bold' }}
            suppressHighlighting
          >
            {user.username}
          </Text>
          <Text
            style={{ fontSize: 12 }}
            suppressHighlighting
          >{`Joined ${moment.unix(user.date_joined).format('MM/DD/YYYY')}`}</Text>
        </View>

        <FriendButton
          isFriend={user.isFriend}
          onPress={onFriendPress}
        />
      </View>
    </TouchableHighlight>
  );
};

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  onUserPress: PropTypes.func.isRequired,
  onFriendPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  cardContainerStyle: {
    width: Dimensions.get('window').width,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
  },
  textViewStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10
  },
});

export default UserCard;
