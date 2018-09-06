import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input, Button } from '../../components/common';
import { isValidInput } from '../../assets/helpers';

export class SignUpScreen extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  handleChangeText = (text, id) => {
    switch (id) {
      case 0:
        this.setState(() => ({ username: text }));
        break;
      case 1:
        this.setState(() => ({ password: text }));
        break;
      case 2:
        this.setState(() => ({ confirmPassword: text }));
        break;
      default:
        break;
    }
  }

  logIn = () => {
    const { username, password, confirmPassword } = this.state;

    // Check spaces
    if (isValidInput([username, password, confirmPassword])) {
      // Check password match
      if (password === confirmPassword) {
        // TODO: Handle signing up here
      } else {
        // TODO: Handle invalid input message here
      }
    } else {
      // TODO: Handle invalid input message here
    }
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text>Sign Up Screen!</Text>
        <Input
          placeholder="Username"
          onChangeText={text => this.handleChangeText(text, 0)}
          value={this.state.username}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          onChangeText={text => this.handleChangeText(text, 1)}
          value={this.state.password}
        />
        <Input
          placeholder="Confirm Password"
          secureTextEntry
          onChangeText={text => this.handleChangeText(text, 2)}
          value={this.state.confirmPassword}
        />
        <Button onPress={this.logIn}>Log In</Button>
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
