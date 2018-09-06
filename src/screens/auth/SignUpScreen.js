import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const SignUpScreen = () => (
  <View style={styles.viewStyle}>
    <Text>Sign Up Screen!</Text>
  </View>
);

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
