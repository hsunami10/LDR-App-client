import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { Input, Button } from '../../components/common';
import { isValidInput } from '../../assets/helpers';
import { signUpWithUsernameAndPassword } from '../../actions/AuthActions';
import { SpinnerOverlay } from '../../components/common';

class SignUpScreen extends Component {
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

  signUp = () => {
    const { username, password, confirmPassword } = this.state;

    // Check spaces
    if (isValidInput([username, password, confirmPassword])) {
      // Check password match
      if (password === confirmPassword) {
        // Check password length
        if (password.length >= 6) {
          this.props.signUpWithUsernameAndPassword(username, password);
        } else {
          // TODO: Handle invalid password length message here
        }
      } else {
        // TODO: Handle passwod doesn't match message here
      }
    } else {
      // TODO: Handle invalid input message here
    }
  }

  signUpFB = () => {
    // TODO: Use Facebook SDK to sign up
    console.log('sign up with facebook sdk');
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
        <Button onPress={this.signUp}>Sign Up</Button>
        <Button onPress={this.signUpFB}>Sign up with Facebook</Button>
        <SpinnerOverlay visible={this.props.loading} text="Signing Up..." />
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

const mapStateToProps = state => {
  return {
    loading: state.auth.loading
  };
};

export default connect(mapStateToProps, { signUpWithUsernameAndPassword })(SignUpScreen);
