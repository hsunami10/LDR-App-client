import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage } from '../common';
import ActionButton from './ActionButton';

class UserCard extends Component {
  // QUESTION: Is this even necessary? Displaying this information?
  // Is having a message for requests even necessary?
  renderData = () => {
    switch (this.props.user.type) {
      case 'regular':
        return (
          <Text style={{ fontSize: 12 }} suppressHighlighting>
            {`Joined ${moment(moment.unix(this.props.user.date_joined)).fromNow(true)} ago`}
          </Text>
        );
      case 'friend':
        return (
          <Text style={{ fontSize: 12 }} suppressHighlighting>
            {`Friended ${moment(moment.unix(this.props.user.date_friended)).fromNow(true)} ago`}
          </Text>
        );
      case 'request':
        return (
          <Text style={{ fontSize: 12 }} suppressHighlighting>
            {this.props.user.message}
          </Text>
        );
      case 'pending':
        return (
          <Text style={{ fontSize: 12 }} suppressHighlighting>
            {`Sent ${moment(moment.unix(this.props.user.date_sent)).fromNow(true)} ago`}
          </Text>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => this.props.onUserPress(this.props.user.id, this.props.user.username)}
        underlayColor="rgba(0,0,0,0.3)"
      >
        <View style={styles.cardContainerStyle}>
          <ClickableImage
            width={40}
            height={40}
            type="none"
            disabled
            image={this.props.user.profile_pic ? `${ROOT_URL}/${this.props.user.profile_pic}` : null}
          />

          <View style={styles.textViewStyle}>
            <Text
              style={{ fontWeight: 'bold' }}
              suppressHighlighting
            >
              {this.props.user.username}
            </Text>
            {this.renderData()}
          </View>

          <ActionButton
            id={this.props.user.id}
            type={this.props.user.type}
            onPress={this.props.onActionPress}
            onRequestPress={this.props.onRequestPress}
          />
        </View>
      </TouchableHighlight>
    );
  }
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  onUserPress: PropTypes.func.isRequired,
  onActionPress: PropTypes.func.isRequired,
  onRequestPress: PropTypes.func.isRequired,
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
