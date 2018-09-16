import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class SettingsScreen extends Component {
  render() {
    return (
      <View style={styles.centerItems}>
        <Text>Settings Screen!</Text>
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

export default SettingsScreen;
