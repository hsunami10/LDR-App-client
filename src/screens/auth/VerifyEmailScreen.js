import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { DismissKeyboard, StandardHeader, Input, Button, FullScreenLoading } from '../../components/common';
import { isValidEmail } from '../../assets/helpers/text';
import {
  setAuthErrors,
  resetAuthErrors,
  sendVerificationEmail
} from '../../actions/AuthActions';
import { pushTabRoute } from '../../actions/NavigationActions';
import textStyles from '../../constants/styles/text';

// TODO: Stop users from spamming "send email"
class VerifyEmailScreen extends Component {
  state = { email: '', width: 0, height: 0 }

  componentWillUnmount() {
    this.resetEverything();
  }

  resetEverything = () => {
    this.setState(() => ({ email: '' }));
    this.props.resetAuthErrors('verify_email');
  }

  handleRightPress = () => {
    this.props.pushTabRoute('home', null);
    this.props.navigation.navigate('App');
    this.resetEverything();
  }

  handleChangeText = email => this.setState(() => ({ email }))

  handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    this.setState(() => ({ width, height }));
  }

  sendEmail = () => {
    Keyboard.dismiss();
    if (isValidEmail(this.state.email)) {
      this.props.resetAuthErrors('verify_email');
      this.props.sendVerificationEmail(this.props.id, this.state.email);
    } else {
      this.props.setAuthErrors('verify_email', 'email', 'Invalid email');
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
              showBorder={this.props.error_field === 'email'}
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
          <FullScreenLoading loading={this.props.loading} />
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
  pushTabRoute: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = state => ({
  id: state.auth.id,
  error_field: state.auth.verify_email_field,
  error_msg: state.auth.verify_email_error,
  loading: state.loading,
  success: state.auth.verify_email_success
});

export default connect(mapStateToProps, {
  resetAuthErrors,
  setAuthErrors,
  sendVerificationEmail,
  pushTabRoute
})(VerifyEmailScreen);
