import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { ClickableImage } from '../common';
import Plus from '../../assets/images/plus.png';
import GreenV from '../../assets/images/green_check.png';

// Show "subscribe" button if type = 'not_subscribed'
// Don't show any button if type = 'already_subscribed'
// Show "subscribed" button if type = 'just_subscribed'
class TopicCardActions extends Component {
  renderAction = () => {
    switch (this.props.type) {
      case 'not_subscribed':
        return (
          <View style={styles.viewStyle}>
            <ClickableImage
              width={30}
              height={30}
              image={Plus}
              type="none"
              disabled
            />
            <Text>Subscribe</Text>
          </View>
        );
      case 'already_subscribed':
        return <View />;
      case 'just_subscribed':
        return (
          <View style={styles.viewStyle}>
            <ClickableImage
              width={30}
              height={30}
              image={GreenV}
              type="none"
              disabled
            />
            <Text>Subscribed</Text>
          </View>
        );
      default:
        return <View />;
    }
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <TouchableHighlight
          style={styles.buttonStyle}
          onPress={() => this.props.onPress(this.props.id, this.props.type)}
          underlayColor="rgba(0,0,0,0.3)"
        >
          {this.renderAction()}
        </TouchableHighlight>
      </View>
    );
  }
}

TopicCardActions.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  containerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  viewStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default TopicCardActions;
