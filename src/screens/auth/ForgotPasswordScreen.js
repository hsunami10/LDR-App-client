import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

const ForgotPasswordScreen = () => (
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

export default ForgotPasswordScreen;
