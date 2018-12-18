import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { ClickableImage } from '../common';
import Plus from '../../assets/images/plus.png';
import GreenV from '../../assets/images/green_check.png';
import Clock from '../../assets/images/clock.png';
import UserRequestButtons from './UserRequestButtons';

class UserCardActions extends Component {
  renderAction = () => {
    switch (this.props.user.type) {
      case 'regular':
        return (
          <View style={styles.viewStyle}>
            <ClickableImage
              width={30}
              height={30}
              image={Plus}
              type="none"
              disabled
            />
            <Text>Friend</Text>
          </View>
        );
      case 'friend':
        return (
          <View style={styles.viewStyle}>
            <ClickableImage
              width={30}
              height={30}
              image={GreenV}
              type="none"
              disabled
            />
            <Text>Friends</Text>
          </View>
        );
      case 'pending':
        return (
          <View style={[styles.viewStyle, styles.pendingStyle]}>
            <ClickableImage
              width={30}
              height={30}
              image={Clock}
              type="none"
              disabled
            />
            <Text>Pending</Text>
          </View>
        );
      default:
        return null;
    }
  }

  render() {
    if (this.props.user.type === 'request') {
      return (
        <UserRequestButtons
          onAcceptPress={() => this.props.onRequestPress(this.props.user.id, true)}
          onRejectPress={() => this.props.onRequestPress(this.props.user.id, false)}
        />
      );
    }
    return (
      <View style={styles.containerStyle}>
        <TouchableHighlight
          style={styles.buttonStyle}
          onPress={() => this.props.onActionPress(this.props.user.id, this.props.user.type)}
          underlayColor="rgba(0,0,0,0.3)"
        >
          {this.renderAction()}
        </TouchableHighlight>
      </View>
    );
  }
}

UserCardActions.propTypes = {
  user: PropTypes.object.isRequired,
  onActionPress: PropTypes.func.isRequired,
  onRequestPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pendingStyle: {
    backgroundColor: '#C0C0C0'
  },
  buttonStyle: {
    marginLeft: 'auto',
    marginRight: 0,
  }
});

export default UserCardActions;
