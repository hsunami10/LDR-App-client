import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { isValidCredentials } from '../../assets/helpers';
import {
  setAuthErrors,
  resetAuthErrors,
  signUpWithUsernameAndPassword
} from '../../actions/AuthActions';
import {
  FullScreenLoading,
  Input,
  Button,
  StandardHeader,
  DismissKeyboard
} from '../../components/common';
import { navigateToRoute } from '../../actions/NavigationActions';
import textStyles from '../../constants/styles/text';

class SignUpScreen extends Component {
  state = {
    username: '',
    password: '',
    confirmPassword: ''
  }

  componentWillUnmount() {
    if (this.props.current_route === 'SignUp') {
      this.props.navigateToRoute('Welcome');
      this.resetEverything();
    }
  }

  // Pseudo componentWillUnmount
  resetEverything = () => {
    this.setState(() => ({ username: '', password: '', confirmPassword: '' }));
    this.props.resetAuthErrors();
  }

  handleLeftPress = () => this.props.navigation.pop()

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

    const { status, type, msg } = isValidCredentials([username, password, confirmPassword]);
    // Check spaces
    if (status) {
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
      this.props.setAuthErrors(type, msg);
    }
  }

  render() {
    console.log(this.props.loading);
    return (
      <DismissKeyboard>
        <View style={{ flex: 1 }}>
          <StandardHeader
            showLeft
            title="Sign Up"
            leftTitle="Back"
            onLeftPress={this.handleLeftPress}
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
              onSubmitEditing={this.signUp}
              returnKeyType="go"
            />
            <Text style={textStyles.errorTextStyle}>{this.props.error_msg}</Text>
            <Button onPress={this.signUp}>Sign Up</Button>
          </View>
          <FullScreenLoading loading={this.props.loading} />
        </View>
      </DismissKeyboard>
    );
  }
}

SignUpScreen.propTypes = {
  resetAuthErrors: PropTypes.func.isRequired,
  signUpWithUsernameAndPassword: PropTypes.func.isRequired,
  setAuthErrors: PropTypes.func.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  error_field: PropTypes.string.isRequired,
  error_msg: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  current_route: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  current_route: state.navigation.current_route,
  error_field: state.auth.error_field,
  error_msg: state.auth.error_msg,
  loading: state.loading
});

export default connect(mapStateToProps, {
  setAuthErrors,
  resetAuthErrors,
  signUpWithUsernameAndPassword,
  navigateToRoute
})(SignUpScreen);
