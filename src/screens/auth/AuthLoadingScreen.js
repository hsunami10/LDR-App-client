import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import { NetInfo, AppState, Platform, BackHandler, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { FullScreenLoading } from '../../components/common';
import { setActive, setUserCredentials } from '../../actions/AuthActions';
import { pushRoute, goBackwardRoute, replaceCurrentRoute } from '../../actions/NavigationActions';
import { handleError, showNoConnectionAlert, getConnectionInfo } from '../../assets/helpers';

class AuthLoadingScreen extends Component {
  state = { appState: AppState.currentState }

  componentDidMount() {
    /*
    App only mounts with an initial app state of "background" if BackHandler.exitApp() in android was pressed
    iOS:
      - first start up: "unknown" to "active"
      - minimize (home button): "active" to "inactive", "inactive" to "background"
      - view apps (double press home button): "active" to "inactive"
      - normal terminate: "active" to "inactive", "inactive" to "background"
    Android:
      - first start up: "active" to "active"
      - minimize (home button): "active" to "background"
      - view apps (right hardware button): "active" to "background"
      - normal terminate: "active" to "background"
      - back handler exit pressed: remove all listeners, but when coming back
     */
    if (Platform.OS === 'android' && this.state.appState === 'background') {
      getConnectionInfo()
        .then(connectionInfo => {
          this.getLoginInfo(connectionInfo.type !== 'none');
        });
    }

    // NOTE: THis runs once by default when the app first starts, not coming from background
    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);
    AppState.addEventListener('change', this.handleAppStateChange);

    if (Platform.OS === 'android') {
      // NOTE: Make sure these keys are the same as the keys in MainScreen.js - state.routes array
      // Also make sure it's exactly the same as the one in MainScreen.js
      const mainScreenTabKeys = { feed: 0, discover: 1, notifications: 3, profile: 4 };
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        /*
        When android hardware back button is pressed:
        State is not reset - only components are unmounted, state does not reset

        Disable back button (don't do anything) when:
          - current_route === 'CreateProfile'
          - current_route === 'VerifyEmail'

        Override back button action by exiting the app when:
          - current_route === 'Welcome'
          - routes[routes.length - 2] === 'Main'

        Override back button behavior by going back tabs when:
          - current_route is a tab key in MainScreen.js AND previous route is a tab key in MainScreen.js
         */
        const length = this.props.routes.length;
        if (this.props.current_route === 'Welcome' || this.props.routes[length - 2] === 'Main') {
          if (this.props.current_route === 'Welcome') {
            this.props.goBackwardRoute(); // Reset current_route to AuthLoading (when logged out)
          } else {
            // NOTE: If the default main tab screen changes, change this too
            this.props.replaceCurrentRoute('feed'); // Set default screen to be "feed" (when logged in)
          }
          BackHandler.exitApp();
          return true;
        } else if (this.props.current_route === 'CreateProfile' || this.props.current_route === 'VerifyEmail') {
          return true; // Disable back button on routes
        } else if (
          mainScreenTabKeys[this.props.current_route] !== undefined &&
          mainScreenTabKeys[this.props.routes[length - 2]] !== undefined
        ) {
          this.props.goBackwardRoute();
          return true;
        }
        return false;
      });
    }
  }

  componentWillUnmount() {
    this.backHandler.remove();
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  getLoginInfo = async isConnected => {
    if (!isConnected) {
      showNoConnectionAlert();
    } else {
      try {
        const credentials = await Keychain.getGenericPassword(); // { id, firstLogin }
        if (credentials) {
          this.props.setUserCredentials(credentials.username, credentials.password === 'true');
          this.props.pushRoute('Main');
          setActive(credentials.username, true);
          this.props.navigation.navigate('App');
        } else {
          this.props.pushRoute('Welcome');
          this.props.navigation.navigate('Auth');
        }
      } catch (e) {
        handleError(new Error(`Unable to access keychain. ${e.message}`), false);
      }
    }
  }

  handleAppStateChange = nextAppState => {
    this.setState(() => ({ appState: nextAppState }));
  }

  handleConnectionChange = isConnected => {
    if (this.props.current_route === 'AuthLoading') {
      this.getLoginInfo(isConnected);
    } else if (!isConnected) {
      showNoConnectionAlert();
    }
  }

  render() {
    return (
      <FullScreenLoading
        visible
        width={Dimensions.get('window').width}
        height={Dimensions.get('window').height}
        text="Authenticating..."
      />
    );
  }
}

AuthLoadingScreen.propTypes = {
  setUserCredentials: PropTypes.func.isRequired,
  current_route: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  pushRoute: PropTypes.func.isRequired,
  goBackwardRoute: PropTypes.func.isRequired,
  replaceCurrentRoute: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  current_route: state.navigation.current_route,
  routes: state.navigation.routes
});

export default connect(mapStateToProps, {
  setUserCredentials,
  pushRoute,
  goBackwardRoute,
  replaceCurrentRoute
})(AuthLoadingScreen);
