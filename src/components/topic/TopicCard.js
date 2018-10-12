import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

// TODO: Finish post cards - to show in feed
class TopicCard extends Component {
  render() {
    return (
      <View style={styles.viewStyle}>
        <Text>Topic Card!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default TopicCard;
