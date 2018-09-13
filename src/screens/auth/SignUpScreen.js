import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { isValidInput } from '../../assets/helpers';
import {
  closeFatalError,
  signUpWithUsernameAndPassword
} from '../../actions/AuthActions';
import { SpinnerOverlay, Input, Button } from '../../components/common';

class SignUpScreen extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  componentWillReceiveProps(newProps) {
    if (newProps.fatal_title !== '') {
      Alert.alert(
        newProps.fatal_title,
        newProps.error_msg,
        [
          { text: 'OK', onPress: () => this.props.closeFatalError() },
        ],
        { onDismiss: () => this.props.closeFatalError() }
      );
    }
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
          this.props.signUpWithUsernameAndPassword(username, password, this.props.navigation);
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
    console.log(this.props);
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
        <SpinnerOverlay visible={this.props.loading} />
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

const mapStateToProps = state => ({
  fatal_title: state.auth.fatal_title,
  error_msg: state.auth.error_msg,
  loading: state.auth.loading
});

export default connect(mapStateToProps, {
  closeFatalError,
  signUpWithUsernameAndPassword
})(SignUpScreen);
