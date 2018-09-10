import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { ROOT_URL } from '../../constants/variables';

const WelcomeScreen = props => (
  <View style={styles.viewStyle}>
    <Text>Welcome Screen!</Text>
    <Button
      onPress={() => props.navigation.navigate('LogIn')}
      title="Log In"
      color="blue"
    />
    <Button
      onPress={() => props.navigation.navigate('SignUp')}
      title="Sign Up"
      color="blue"
    />
    {/* TODO: Remove this later */}
    <Image
      style={{ width: 50, height: 50 }}
      source={{ uri: `${ROOT_URL}/images/groups/nature.jpeg` }}
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

export default WelcomeScreen;
