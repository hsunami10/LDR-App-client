import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';
import { ClickableImage } from '../common';
import Plus from '../../assets/images/plus.png';
import GreenV from '../../assets/images/green_check.png';
import Clock from '../../assets/images/clock.png';
import UserRequestButtons from './UserRequestButtons';

class ActionButton extends Component {
  renderAction = () => {
    switch (this.props.type) {
      case 'regular':
        return (
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
        );
      case 'friend':
        return (
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
        );
      case 'pending':
        return (
          <View style={styles.viewStyle}>
            <ClickableImage
              width={30}
              height={30}
              image={Clock}
              type="none"
              onPress={() => null}
            />
            <Text>Pending</Text>
          </View>
        );
      default:
        return null;
    }
  }

  render() {
    if (this.props.type === 'request') {
      return (
        <UserRequestButtons
          onAcceptPress={() => this.props.onRequestPress(true)}
          onRejectPress={() => this.props.onRequestPress(false)}
        />
      );
    }
    return (
      <TouchableHighlight
        onPress={() => this.props.onPress(this.props.type)}
        underlayColor="rgba(0,0,0,0.3)"
      >
        {this.renderAction()}
      </TouchableHighlight>
    );
  }
}

ActionButton.propTypes = {
  onPress: PropTypes.func.isRequired,
  onRequestPress: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default ActionButton;
