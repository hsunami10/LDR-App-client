import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ForgotPasswordScreen = () => (
  <View style={styles.viewStyle}>
    <Text>Forgot Password Modal!</Text>
  </View>
);

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
