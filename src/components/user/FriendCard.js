import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage } from '../../components/common';

const FriendCard = ({ user, onPress }) => {
  return (
    <TouchableHighlight
      style={styles.cardContainerStyle}
      onPress={onPress}
      underlayColor="rgba(0,0,0,0.3)"
    >
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
    </TouchableHighlight>
 );
};

FriendCard.propTypes = {
  user: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  cardContainerStyle: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  textViewStyle: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
    marginRight: 10
  },
  actionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FriendCard;
