import React, { Component } from 'react';
import * as Keychain from 'react-native-keychain';
import { FullScreenLoading } from '../../components/common';
import { setActive } from '../../actions/AuthActions';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.getLoginInfo()
      .then(obj => {
        if (obj) {
          this.props.navigation.navigate('App');
          setActive({ id: obj.username, bool: true });
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
      const credentials = await Keychain.getGenericPassword(); // NOTE: { uid, uid }
      if (credentials) {
        return Promise.resolve(credentials);
      }
      return Promise.resolve(null);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  render() {
    return <FullScreenLoading text="Authenticating..." />;
  }
}

export default AuthLoadingScreen;
