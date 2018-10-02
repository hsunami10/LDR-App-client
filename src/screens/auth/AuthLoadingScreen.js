import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import { NetInfo, Alert } from 'react-native';
import { connect } from 'react-redux';
import { FullScreenLoading } from '../../components/common';
import { setActive, setUserCredentials } from '../../actions/AuthActions';
import { navigateToRoute } from '../../actions/NavigationActions';
import { handleError, showNoConnectionAlert } from '../../assets/helpers';

// QUESTION: Have auth loading the same as the splash screen, but with a loading indicator?

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);

    // NOTE: THis runs once by default
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  getLoginInfo = async connectionInfo => {
    if (connectionInfo.type === 'none') {
      showNoConnectionAlert();
    } else {
      try {
        const credentials = await Keychain.getGenericPassword(); // { id, firstLogin }
        console.log(credentials);
        if (credentials) {
          // TODO: Check if user exists in database
          // Get basic profile info (enough so it can show while offline), or show first before other info is loaded
          // (username, profile picture, bio)
          // If exists, then navigation to App
          // Otherwise, show alert, remove Keychain credentials, then navigate to Auth
          this.props.setUserCredentials(credentials.username, credentials.password === 'true');
          this.props.navigateToRoute('Main');
          setActive(credentials.username, true);
          this.props.navigation.navigate('App');
        } else {
          this.props.navigateToRoute('Welcome');
          this.props.navigation.navigate('Auth');
        }
      } catch (e) {
        handleError(new Error(`Unable to access keychain. ${e.message}`), true);
      }
    }
  }

  handleConnectionChange = connectionInfo => {
    if (this.props.current_route === 'AuthLoading') {
      this.getLoginInfo(connectionInfo);
    } else if (connectionInfo.type === 'none') {
      showNoConnectionAlert();
    }
  }

  render() {
    return <FullScreenLoading text="Authenticating..." />;
  }
}

AuthLoadingScreen.propTypes = {
  setUserCredentials: PropTypes.func.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  current_route: PropTypes.string.isRequired
};

const mapStateToProps = state => ({ current_route: state.navigation.current_route });

export default connect(mapStateToProps, {
  setUserCredentials,
  navigateToRoute
})(AuthLoadingScreen);
