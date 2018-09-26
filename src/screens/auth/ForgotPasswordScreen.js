import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, TouchableOpacity, Keyboard, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DismissKeyboard, StandardHeader, Input, Button, SpinnerOverlay } from '../../components/common';
import { isValidEmail } from '../../assets/helpers';
import { MIN_HEADER_HEIGHT_NO_STATUS_BAR } from '../../constants/variables';
import { forgotPassword, resetAuthErrors, setAuthErrors } from '../../actions/AuthActions';
import { popRoute } from '../../actions/NavigationActions';
import textStyles from '../../constants/styles/text';

class ForgotPasswordScreen extends Component {
  state = { email: '' }

  componentWillUnmount() {
    this.setState(() => ({ email: '' }));
    this.props.resetAuthErrors();
  }

  close = () => {
    this.props.popRoute('LogIn');
    this.props.navigation.popToTop();
  }

  handleChangeText = email => this.setState(() => ({ email }));

  clearInput = () => this.setState(() => ({ email: '' }));

  sendEmail = () => {
    Keyboard.dismiss();
    if (isValidEmail(this.state.email)) {
      this.props.resetAuthErrors();
      this.props.forgotPassword(this.state.email, this.props.navigation, this.clearInput);
    } else {
      this.props.setAuthErrors('username', 'Invalid email');
    }
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={{ flex: 1 }}>
          <StandardHeader
            title="Forgot Password"
            showLeft
            headerLeft={
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={this.close}
              >
                <Icon name={`${Platform.OS}-close`} size={45} />
              </TouchableOpacity>
            }
          />
          <View style={styles.viewStyle}>
            <Input
              placeholder="Email"
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
            <SpinnerOverlay visible={this.props.loading} />
          </View>
        </View>
      </DismissKeyboard>
    );
  }
}

ForgotPasswordScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  setAuthErrors: PropTypes.func.isRequired,
  resetAuthErrors: PropTypes.func.isRequired,
  popRoute: PropTypes.func.isRequired,
  success: PropTypes.bool.isRequired,
  error_msg: PropTypes.string.isRequired,
  error_field: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonStyle: {
    width: MIN_HEADER_HEIGHT_NO_STATUS_BAR,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  error_field: state.auth.error_field,
  error_msg: state.auth.error_msg,
  success: state.auth.success,
  loading: state.loading
});

export default connect(mapStateToProps, {
  forgotPassword,
  setAuthErrors,
  resetAuthErrors,
  popRoute
})(ForgotPasswordScreen);
