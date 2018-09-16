import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class ViewPostScreen extends Component {
  render() {
    return (
      <View style={styles.centerItems}>
        <Text>View Post Screen!</Text>
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

export default ViewPostScreen;
