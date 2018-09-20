import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import {
  Input,
  Button,
  StandardHeader,
  DismissKeyboard,
  SpinnerOverlay
} from '../../components/common';
import {
  setAuthErrors,
  resetAuthErrors,
  logInWithUsernameAndPassword
} from '../../actions/AuthActions';
import { navigateToRoute, goBackwardRoute } from '../../actions/NavigationActions';
import { isValidInput } from '../../assets/helpers';
import textStyles from '../../constants/styles/text';

class LogInScreen extends Component {
  state = {
    username: '',
    password: '',
  }

  componentWillUnmount() {
    this.resetEverything();
  }

  resetEverything = () => {
    this.setState(() => ({ username: '', password: '' }));
    this.props.resetAuthErrors();
  }

  handleLeftPress = () => {
    this.props.goBackwardRoute();
    this.props.navigation.goBack();
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
    Keyboard.dismiss();
    this.props.navigateToRoute('ForgotPassword');
    this.props.navigation.navigate('ForgotPassword');
  }

  logIn = () => {
    const { username, password } = this.state;
    Keyboard.dismiss();

    // Check spaces
    if (isValidInput([username, password])) {
      this.props.resetAuthErrors();
      this.props.logInWithUsernameAndPassword(
        { username, password },
        this.props.navigation,
        this.resetEverything
      );
    } else {
      this.props.setAuthErrors('', 'Invalid username or password');
    }
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={{ flex: 1 }}>
          <StandardHeader
            showLeft
            title="Log In"
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
            />
            <Text style={textStyles.errorTextStyle}>{this.props.error_msg}</Text>
            <Button onPress={this.logIn}>Log In</Button>
            <Button onPress={this.forgotPassword}>Forgot Password?</Button>
          </View>
          <SpinnerOverlay visible={this.props.loading} />
        </View>
      </DismissKeyboard>
    );
  }
}

LogInScreen.propTypes = {
  error_field: PropTypes.string.isRequired,
  error_msg: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  logInWithUsernameAndPassword: PropTypes.func.isRequired,
  setAuthErrors: PropTypes.func.isRequired,
  resetAuthErrors: PropTypes.func.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  goBackwardRoute: PropTypes.func.isRequired
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
  logInWithUsernameAndPassword,
  navigateToRoute,
  goBackwardRoute
})(LogInScreen);
