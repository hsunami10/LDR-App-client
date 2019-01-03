import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import { NetInfo, AppState, Platform, BackHandler, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { FullScreenLoading } from '../../components/common';
import { setUserCredentials, logOutUser } from '../../actions/AuthActions';
import { navigateToRoute, goBackwardRoute, pushTabRoute } from '../../actions/NavigationActions';
import { handleError } from '../../assets/helpers/errors';
import { showNoConnectionAlert, getConnectionInfo } from '../../assets/helpers/connection';

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

        TODO: Change back button behavior to expected - pop to top of navigation
        Override back button behavior by going back tabs when:
          - current_route is a tab key in MainScreen.js AND previous route is a tab key in MainScreen.js

        TODO TODO TODO TODO TODO TODO TODO Fix this with new navigator - don't use this.props.routes anymore
         */
        if (
          this.props.current_route === 'Welcome' ||
          ((this.props.current_route === 'home' && this.props.current_tab === this.props.current_route))
        ) {
          this.props.logOutUser(); // Reset app state
          // if (this.props.current_route === 'Welcome') {
          //   this.props.navigateToRoute('AuthLoading'); // Reset current_route to AuthLoading (when logged out)
          // } else {
          //   // If the default main tab screen changes, change this too
          //   this.props.navigateToRoute('feed'); // Set default screen to be "feed" (when logged in)
          // }
          BackHandler.exitApp();
          return true;
        } else if (this.props.current_route === 'CreateProfile' || this.props.current_route === 'VerifyEmail') {
          return true; // Disable back button on these routes
        }
        // else if (
        //   this.props.tab_routes[this.props.current_route] !== undefined &&
        //   this.props.tab_routes[this.props.routes[length - 2]] !== undefined
        // ) {
        //   this.props.goBackwardRoute();
        //   return true;
        // }
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
          this.props.pushTabRoute('home', null);
          // this.props.navigation.navigate('CreateProfile'); // TODO: Remove this later - efficient testing only
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

  handleAppStateChange = nextAppState => {
    this.setState(() => ({ appState: nextAppState }));
  }

  handleConnectionChange = isConnected => {
    if (this.props.current_route === 'AuthLoading') {
      this.getLoginInfo(isConnected);
      // this.getLoginInfo(true); // NOTE: Uncomment if no internet - for testing ONLY
    } else if (!isConnected) {
      showNoConnectionAlert();
    }
  }

  render() {
    return (
      <FullScreenLoading
        loading
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
  current_tab: PropTypes.string.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  goBackwardRoute: PropTypes.func.isRequired,
  tab_routes: PropTypes.object.isRequired,
  pushTabRoute: PropTypes.func.isRequired,
  logOutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  current_route: state.navigation.current_route,
  current_tab: state.navigation.current_tab,
  tab_routes: state.navigation.tab_routes
});

export default connect(mapStateToProps, {
  setUserCredentials,
  navigateToRoute,
  goBackwardRoute,
  pushTabRoute,
  logOutUser
})(AuthLoadingScreen);
