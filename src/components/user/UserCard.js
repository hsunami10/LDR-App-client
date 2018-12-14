import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { requireWhenPropExists } from '../../assets/helpers/errors/proptypes';
import { ClickableImage } from '../common';
import FriendButton from './FriendButton';

class UserCard extends Component {
  renderAction() {
    if (this.props.regular) {
      return (
        <FriendButton
          isFriend={this.props.user.isFriend}
          onPress={this.props.onFriendPress}
        />
      );
    } else if (this.props.request) {
      return (
        <Text>Show Request Actions Here</Text>
      );
    }
    return null;
  }

  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onUserPress}
        underlayColor="rgba(0,0,0,0.3)"
      >
        <View style={styles.cardContainerStyle}>
          <ClickableImage
            width={40}
            height={40}
            type="none"
            onPress={() => null}
            image={this.props.user.profile_pic ? `${ROOT_URL}/${this.props.user.profile_pic}` : null}
          />

          <View style={styles.textViewStyle}>
            <Text
              style={{ fontWeight: 'bold' }}
              suppressHighlighting
            >
              {this.props.user.username}
            </Text>
            <Text
              style={{ fontSize: 12 }}
              suppressHighlighting
            >{`Joined ${moment.unix(this.props.user.date_joined).format('MM/DD/YYYY')}`}</Text>
          </View>

          {this.renderAction()}
        </View>
      </TouchableHighlight>
    );
  }
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  onUserPress: PropTypes.func.isRequired,

  regular: PropTypes.bool,
  onFriendPress: (props, propName, componentName) => requireWhenPropExists('regular', props, propName, componentName, 'function'),

  request: PropTypes.bool,
  onRequestPress: (props, propName, componentName) => requireWhenPropExists('request', props, propName, componentName, 'function'),
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
