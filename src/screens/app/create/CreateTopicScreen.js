import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

class CreateTopicScreen extends Component {
  render() {
    return (
      <View style={styles.centerItems}>
        <Text>Create Topic Screen!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CreateTopicScreen;
