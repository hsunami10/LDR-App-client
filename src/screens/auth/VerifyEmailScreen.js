import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { DismissKeyboard, StandardHeader, Input, Button, FullScreenLoading } from '../../components/common';
import { isValidEmail, handleError } from '../../assets/helpers';
import {
  setAuthErrors,
  resetAuthErrors,
  sendVerificationEmail,
  removeCredentials,
  getUserInfo
} from '../../actions/AuthActions';
import { pushRoute, popRoute } from '../../actions/NavigationActions';
import textStyles from '../../constants/styles/text';

class VerifyEmailScreen extends Component {
  state = { email: '', width: 0, height: 0 }

  componentWillUnmount() {
    this.resetEverything();
  }

  resetEverything = () => {
    this.setState(() => ({ email: '' }));
    this.props.resetAuthErrors();
  }

  handleRightPress = () => {
    this.props.getUserInfo(this.props.id, 'private', false, undefined, {
      navToApp: this.navToApp,
      navToAuth: this.navToAuth
    });
  }

  navToApp = () => {
    this.props.pushRoute('Main');
    this.props.navigation.navigate('App');
    this.resetEverything();
  }

  navToAuth = () => {
    removeCredentials()
      .then(() => {
        this.props.popRoute('AuthLoading');
        this.props.pushRoute('Welcome');
        this.props.navigation.navigate('Welcome');
      })
      .catch(error => {
        handleError(error);
      });
  }

  handleChangeText = email => this.setState(() => ({ email }))

  handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    this.setState(() => ({ width, height }));
  }

  sendEmail = () => {
    Keyboard.dismiss();
    if (isValidEmail(this.state.email)) {
      this.props.resetAuthErrors();
      this.props.sendVerificationEmail(this.props.id, this.state.email);
    } else {
      this.props.setAuthErrors('username', 'Invalid email');
    }
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={{ flex: 1 }}>
          <StandardHeader
            showRight
            rightTitle={this.props.success ? 'Next' : 'Skip'}
            title="Verify Email"
            onRightPress={this.handleRightPress}
            disableBack
            disableRight={this.props.loading}
          />
          <View style={styles.centerItems} onLayout={this.handleLayout}>
            <Input
              placeholder="Email (optional)"
              onChangeText={this.handleChangeText}
              value={this.state.email}
              showBorder={this.props.error_field === 'username'}
              onSubmitEditing={this.sendEmail}
              returnKeyType="send"
            />
            <Text
              style={
                this.props.success ?
                textStyles.successTextStyle :
                textStyles.errorTextStyle
              }
            >
              {this.props.error_msg}
            </Text>
            <Button onPress={this.sendEmail}>Send Email</Button>
            <Text>Verify your email to receive developer updates, polls, forgotten passwords, and send feedback, bug reports, user reports, new ideas, and topic requests</Text>
          </View>
          <FullScreenLoading visible={this.props.loading} />
        </View>
      </DismissKeyboard>
    );
  }
}

VerifyEmailScreen.propTypes = {
  resetAuthErrors: PropTypes.func.isRequired,
  setAuthErrors: PropTypes.func.isRequired,
  sendVerificationEmail: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  error_field: PropTypes.string.isRequired,
  error_msg: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  success: PropTypes.bool.isRequired,
  pushRoute: PropTypes.func.isRequired,
  popRoute: PropTypes.func.isRequired,
  getUserInfo: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  id: state.auth.id,
  error_field: state.auth.error_field,
  error_msg: state.auth.error_msg,
  loading: state.loading,
  success: state.auth.success
});

export default connect(mapStateToProps, {
  resetAuthErrors,
  setAuthErrors,
  sendVerificationEmail,
  pushRoute,
  popRoute,
  getUserInfo
})(VerifyEmailScreen);
