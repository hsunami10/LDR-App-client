import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { isValidInput } from '../../assets/helpers';
import {
  setAuthErrors,
  resetAuthErrors,
  signUpWithUsernameAndPassword
} from '../../actions/AuthActions';
import {
  SpinnerOverlay,
  Input,
  Button,
  StandardHeader,
  DismissKeyboard
} from '../../components/common';
import textStyles from '../../constants/styles/text';

class SignUpScreen extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  componentWillUnmount() {
    this.resetEverything();
  }

  // Pseudo componentWillUnmount
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
    Keyboard.dismiss();

    // Check spaces
    if (isValidInput([username, password, confirmPassword])) {
      // Check password match
      if (password === confirmPassword) {
        // Check password length
        if (password.length >= 6) {
          this.props.resetAuthErrors();
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

  render() {
    return (
      <DismissKeyboard>
        <View>
          <StandardHeader
            showLeft
            title="Sign Up"
            leftTitle="Back"
            onLeftPress={() => this.props.navigation.goBack()}
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
              onSubmitEditing={() => console.log('submit')}
            />
            <Text style={textStyles.errorTextStyle}>{this.props.error_msg}</Text>
            <Button onPress={this.signUp}>Sign Up</Button>
          </View>
          <SpinnerOverlay visible={this.props.loading} />
        </View>
      </DismissKeyboard>
    );
  }
}

SignUpScreen.propTypes = {
  resetAuthErrors: PropTypes.func.isRequired,
  signUpWithUsernameAndPassword: PropTypes.func.isRequired,
  setAuthErrors: PropTypes.func.isRequired,
  error_field: PropTypes.string.isRequired,
  error_msg: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired
};

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
