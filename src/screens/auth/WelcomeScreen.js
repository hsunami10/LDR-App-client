import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export const WelcomeScreen = props => (
  <View style={styles.viewStyle}>
    <Text>Welcome Screen!</Text>
    <Button
      onPress={props.navigation.navigate('LogIn')}
      title="Log In"
      color="blue"
    />
    <Button
      onPress={props.navigation.navigate('SignUp')}
      title="Sign Up"
      color="blue"
    />
  </View>
);

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
