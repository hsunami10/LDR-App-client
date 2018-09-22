import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import { NetInfo, Alert } from 'react-native';
import { connect } from 'react-redux';
import { FullScreenLoading } from '../../components/common';
import { setActive, setUserCredentials } from '../../actions/AuthActions';
import { navigateToRoute } from '../../actions/NavigationActions';
import { handleError } from '../../assets/helpers';

// QUESTION: Have auth loading the same as the splash screen, but with a loading indicator?

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);

    // NOTE: THis runs once by default
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
  }

  getLoginInfo = async connectionInfo => {
    if (connectionInfo.type === 'none') {
      this.showNoConnectionAlert();
    } else {
      try {
        const credentials = await Keychain.getGenericPassword(); // { id, firstLogin }
        console.log(credentials);
        if (credentials) {
          this.props.setUserCredentials(credentials.username, credentials.password === 'true');
          this.props.navigateToRoute('Main');
          this.props.navigation.navigate('App');
          setActive(credentials.username, true);
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
      this.showNoConnectionAlert();
    }
  }

  showNoConnectionAlert = () => {
    Alert.alert(
      'Oh no!',
      'You do not have internet connection. Please connect to the internet and try again.',
      [{ text: 'Ok', onPress: () => this.setState(() => ({ alerted: false })) }]
    );
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
