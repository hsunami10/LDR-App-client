import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import { NetInfo, AppState, Platform, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { FullScreenLoading } from '../../components/common';
import { setActive, setUserCredentials } from '../../actions/AuthActions';
import { pushRoute, goBackwardRoute } from '../../actions/NavigationActions';
import { handleError, showNoConnectionAlert } from '../../assets/helpers';

// NOTE: Handle all hardware back presses here

// QUESTION: Have auth loading the same as the splash screen, but with a loading indicator?
// BUG: handleConnectionChange is not called again after "BackHandler.exitApp" is called, because connection is not changing
// TODO: Figure out how to re-run getLoginInfo
// Maybe look at app states, if it's a certain prev + current app state, then run it again?
// Nothing changes when moving to background and from background, so don't have to worry about that

class AuthLoadingScreen extends Component {
  state = { appState: AppState.currentState }

  componentDidMount() {
    // NOTE: THis runs once by default when the app first starts, not coming from background
    NetInfo.addEventListener('connectionChange', this.handleConnectionChange);
    AppState.addEventListener('change', this.handleAppStateChange);

    if (Platform.OS === 'android') {
      // NOTE: Make sure these keys are the same as the keys in MainScreen.js - state.routes array
      // Also make sure it's exactly the same as the one in MainScreen.js
      const mainScreenTabKeys = { feed: 0, discover: 1, notifications: 3, profile: 4 };
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        /*
        When android hardware back button is pressed:

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
          this.backHandler.remove();
          NetInfo.removeEventListener('connectionChange', this.handleConnectionChange);
          AppState.removeEventListener('change', this.handleAppStateChange);
          BackHandler.exitApp(); // BUG: Doing this makes the whole app re-render?
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

  shouldComponentUpdate(newProps, newState) {
    console.log(`old state: ${this.state.appState}`);
    console.log(`new state: ${newState.appState}`);
    // If moving to background or inactive, then don't re-render
    // If moving from background or inactive to foreground, then don't re-render
    // if (
    //   (newState.appState === 'inactive' || newState.appState === 'background') ||
    //   (
    //     (this.state.appState === 'inactive' || this.state.appState === 'background') &&
    //     newState.appState === 'active'
    //   )
    // ) return false;
    return true;
  }

  componentWillUnmount() {
    console.log('unmount auth loading screen');
    this.backHandler.remove();
    NetInfo.removeEventListener('connectionChange', this.handleConnectionChange);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = nextAppState => {
    this.setState(() => ({ appState: nextAppState }));
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

  handleConnectionChange = connectionInfo => {
    console.log('auth loading screen handle connection change');
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
  current_route: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  pushRoute: PropTypes.func.isRequired,
  goBackwardRoute: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  current_route: state.navigation.current_route,
  routes: state.navigation.routes
});

export default connect(mapStateToProps, {
  setUserCredentials,
  pushRoute,
  goBackwardRoute
})(AuthLoadingScreen);
