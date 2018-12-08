import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { ClickableImage } from '../common';
import Plus from '../../assets/images/plus.png';
import GreenV from '../../assets/images/green_check.png';

const FriendButton = ({ isFriend, onPress }) => (
  <TouchableHighlight
    onPress={() => onPress(isFriend)}
    underlayColor="rgba(0,0,0,0.3)"
  >
  {
    isFriend ?
    (
      <View style={styles.viewStyle}>
        <ClickableImage
          width={30}
          height={30}
          image={GreenV}
          type="none"
          onPress={() => null}
        />
        <Text>Friends</Text>
      </View>
    ) :
    (
      <View style={styles.viewStyle}>
        <ClickableImage
          width={30}
          height={30}
          image={Plus}
          type="none"
          onPress={() => null}
        />
        <Text>Friend</Text>
      </View>
    )
  }
  </TouchableHighlight>
);

FriendButton.propTypes = {
  isFriend: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FriendButton;
