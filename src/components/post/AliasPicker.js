import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Picker } from 'react-native';

// TODO: Finish post cards - to show in feed
class AliasPicker extends Component {
  renderItems = () => {

  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text>Post Card!</Text>
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

export default AliasPicker;
