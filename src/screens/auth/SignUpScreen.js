import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { isValidInput } from '../../assets/helpers';
import {
  setAuthErrors,
  resetAuthErrors,
  signUpWithUsernameAndPassword
} from '../../actions/AuthActions';
import { SpinnerOverlay, Input, Button, StandardHeader } from '../../components/common';
import textStyles from '../../constants/styles/text';

class SignUpScreen extends Component {
  // BUG: Swiping back with this goes to the AuthLoadingScreen?
  // TODO: Remove this later -- only for testing swiping back
  static navigationOptions = {
    gesturesEnabled: false
  }

  state = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  componentWillUnmount() {
    this.props.resetAuthErrors();
  }

  // Clear input fields and errors
  resetEverything = () => {
    this.setState(() => ({ username: '', password: '', confirmPassword: '' }));
    this.props.resetAuthErrors();
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
          this.props.signUpWithUsernameAndPassword(
            { username, password },
            this.props.navigation,
            this.resetEverything
          );
        } else {
          this.props.setAuthErrors('password', 'Password must be at least 6 characters');
        }
      } else {
        this.props.setAuthErrors('password', 'Passwords do not match');
      }
    } else {
      this.props.setAuthErrors('', 'Invalid username or password');
    }
  }

  signUpFB = () => {
    // TODO: Use Facebook SDK to sign up
    console.log('sign up with facebook sdk');
  }

  render() {
    return (
      <View>
        <StandardHeader
          showLeft
          title="Sign Up"
          leftTitle="Back"
          onPressLeft={() => this.props.navigation.goBack()}
        />
        <View style={styles.viewStyle}>
          <Input
            placeholder="Username"
            onChangeText={text => this.handleChangeText(text, 0)}
            value={this.state.username}
            showBorder={this.props.error_field === 'username'}
          />
          <Input
            placeholder="Password"
            secureTextEntry
            onChangeText={text => this.handleChangeText(text, 1)}
            value={this.state.password}
            showBorder={this.props.error_field === 'password'}
          />
          <Input
            placeholder="Confirm Password"
            secureTextEntry
            onChangeText={text => this.handleChangeText(text, 2)}
            value={this.state.confirmPassword}
            showBorder={this.props.error_field === 'password'}
          />
          <Text style={textStyles.errorTextStyle}>{this.props.error_msg}</Text>
          <Button onPress={this.signUp}>Sign Up</Button>
          <Button onPress={this.signUpFB}>Sign up with Facebook</Button>
        </View>

        <SpinnerOverlay visible={this.props.loading} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  error_field: state.auth.error_field,
  error_msg: state.auth.error_msg,
  loading: state.loading
});

export default connect(mapStateToProps, {
  setAuthErrors,
  resetAuthErrors,
  signUpWithUsernameAndPassword
})(SignUpScreen);
