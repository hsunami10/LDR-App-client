import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from '../../components/common';
import { isValidInput } from '../../assets/helpers';

class LogInScreen extends Component {
  state = {
    username: '',
    password: '',
  }

  handleChangeText = (text, id) => {
    switch (id) {
      case 0:
        this.setState(() => ({ username: text }));
        break;
      case 1:
        this.setState(() => ({ password: text }));
        break;
      default:
        break;
    }
  }

  forgotPassword = () => {
    // TODO: Implement forgotten password
  }

  logIn = () => {
    const { username, password } = this.state;

    // Check spaces
    if (isValidInput([username, password])) {
      console.log('Valid credentials.');
    } else {
      // TODO: Handle invalid input message here
    }
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text>Log In Screen!</Text>
        <Input
          placeholder="Username"
          onChangeText={text => this.handleChangeText(text, 0)}
          value={this.state.username}
        />
        <Input
          placeholder="Password"
          onChangeText={text => this.handleChangeText(text, 1)}
          value={this.state.password}
        />
        <Button onPress={this.logIn}>Log In</Button>
        <Button onPress={this.forgotPassword}>Forgot Password?</Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default LogInScreen;
