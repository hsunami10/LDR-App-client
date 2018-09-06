import React, { Component } from 'react';
import * as Keychain from 'react-native-keychain';
import { FullScreenLoading } from '../../components/common';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);

    // TODO: Use AsyncStorage to see if the user is already logged in
    this.getLoginInfo()
      .then(obj => {
        if (obj) {
          // TODO: Log in remotely, then go to main default screen (discover or feed)
          console.log('AuthLoadingScreen: Logged in! Go to feed screen');
          this.props.navigation.navigate('App');
        } else {
          // TODO: Go to welcome screen
          console.log('AuthLoadingScreen: Not logged in! Go to auth screen');
          this.props.navigation.navigate('Auth');
        }
      })
      .catch(err => {
        console.log(`AuthLoadingScreen Error: ${err}`);
      });
  }

  async getLoginInfo() {
    try {
      // BUG: Breaks here?
      // BUG: "TypeError: Cannot read property 'resetGenericPasswordForOptions' of undefined"
      const credentials = await Keychain.getGenericPassword(); // NOTE: { uid, email }
      if (credentials) {
        console.log(`Credentials successfully loaded: ${credentials}`);
        return Promise.resolve(credentials);
      }
      console.log('Credentials do not exist.');
      return Promise.resolve(null);
    } catch (e) {
      await Keychain.resetGenericPassword();
      return Promise.reject(e);
    }
  }

  render() {
    return <FullScreenLoading text="Authenticating..." />;
  }
}

export default AuthLoadingScreen;
