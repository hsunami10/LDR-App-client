import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import { NetInfo, AppState, Platform, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { FullScreenLoading } from '../../components/common';
import { setActive, setUserCredentials } from '../../actions/AuthActions';
import { pushRoute, goBackwardRoute, replaceCurrentRoute } from '../../actions/NavigationActions';
import { handleError, showNoConnectionAlert } from '../../assets/helpers';

// QUESTION: Have auth loading the same as the splash screen, but with a loading indicator?
// BUG: handleConnectionChange is not called again after "BackHandler.exitApp" is called, because connection is not changing
// BUG: NetInfo handleConnectionChange doesn't work on simulator + emulator
// TODO: Figure out how to re-run getLoginInfo
// Maybe look at app states, if it's a certain prev + current app state, then run it again?
// Nothing changes when moving to background and from background, so don't have to worry about that

/*
Hangs when:
  - opening app again after pressing back button to exit / minimize
  - turning off internet (at welcome screen), pressing back button to exit / minimize, then going back to app - doesn't show "no internet" alert
 */

class AuthLoadingScreen extends Component {
  state = { appState: AppState.currentState }

  componentDidMount() {
    console.log('app state in auth loading screen mount: ' + this.state.appState);

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
      console.log('coming back from BackHandler.exitApp(), re-check credentials');
      // TODO: Run this.getLoginInfo()?
      // First check to see why NetInfo connectionChange listener isn't running on android emulator
      // Because you don't want to run the same thing twice
      // Check on real device
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
            this.props.goBackwardRoute(); // Reset current_route to AuthLoading
          } else {
            // NOTE: If the default main tab screen changes, change this too
            this.props.replaceCurrentRoute('feed'); // Set default screen to be "feed"
          }
          BackHandler.exitApp();
          return true;
        } else if (this.props.current_route === 'CreateProfile' || this.props.current_route === 'VerifyEmail') {
          return true;
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
    console.log('unmount auth loading screen, remove backhandler, netinfo, appstate listeners');
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
        console.log(credentials);
        if (credentials) {
          // TODO: Check if user exists in database
          // Get basic profile info (enough so it can show while offline), or show first before other info is loaded
          // (username, profile picture, bio)
          // If exists, then navigation to App
          // Otherwise, show alert, remove Keychain credentials, then navigate to Auth
          this.props.setUserCredentials(credentials.username, credentials.password === 'true');
          this.props.pushRoute('Main');
          setActive(credentials.username, true);
          this.props.navigation.navigate('App');
        } else {
          this.props.pushRoute('Welcome');
          this.props.navigation.navigate('Auth');
        }
      } catch (e) {
        handleError(new Error(`Unable to access keychain. ${e.message}`), true);
      }
    }
  }

  handleAppStateChange = nextAppState => {
    console.log(`old state: ${this.state.appState}`);
    console.log(`new state: ${nextAppState}`);
    this.setState(() => ({ appState: nextAppState }));
  }

  handleConnectionChange = isConnected => {
    console.log('auth loading screen handle connection change: ', isConnected);
    if (this.props.current_route === 'AuthLoading') {
      this.getLoginInfo(isConnected);
    } else if (!isConnected) {
      showNoConnectionAlert();
    }
  }

  render() {
    return <FullScreenLoading text="Authenticating..." />;
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
