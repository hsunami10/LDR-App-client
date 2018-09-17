import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Platform, TouchableOpacity, Keyboard, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StandardHeader, Input, Button, SpinnerOverlay } from '../../components/common';
import { MIN_HEADER_HEIGHT_NO_STATUS_BAR } from '../../constants/variables';
import { forgotPassword, resetAuthErrors } from '../../actions/AuthActions';
import textStyles from '../../constants/styles/text';

class ForgotPasswordScreen extends Component {
  state = { email: '' }

  componentWillUnmount() {
    this.setState(() => ({ email: '' }));
    this.props.resetAuthErrors();
  }

  handleChangeText = email => this.setState(() => ({ email }));

  clearInput = () => this.setState(() => ({ email: '' }));

  sendEmail = () => {
    Keyboard.dismiss();
    this.props.forgotPassword(this.state.email, this.props.navigation, this.clearInput);
  }

  render() {
    return (
      <View>
        <StandardHeader
          title="Forgot Password"
          showLeft
          headerLeft={
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => this.props.navigation.popToTop()}
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
          />
          <Text
            style={this.props.success ? textStyles.successTextStyle : textStyles.errorTextStyle}
          >
            {this.props.error_msg}
          </Text>
          <Button onPress={this.sendEmail}>Send Email</Button>
          <SpinnerOverlay visible={this.props.loading} />
        </View>
      </View>
    );
  }
}

ForgotPasswordScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  resetAuthErrors: PropTypes.func.isRequired,
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
  resetAuthErrors
})(ForgotPasswordScreen);
