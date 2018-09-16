import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class DiscoverScreen extends Component {
  render() {
    return (
      <View style={styles.centerItems}>
        <Text>Discover Screen!</Text>
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

export default DiscoverScreen;
