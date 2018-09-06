import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const LogInScreen = () => (
  <View style={styles.viewStyle}>
    <Text>Log In Screen!</Text>
  </View>
);

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
