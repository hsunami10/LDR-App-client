import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux';
import { FullScreenLoading } from '../../components/common';
import { setActive, setUserID } from '../../actions/AuthActions';
import { navigateToRoute } from '../../actions/NavigationActions';
import { handleError } from '../../assets/helpers';

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.getLoginInfo()
      .then(obj => {
        if (obj) {
          this.props.navigateToRoute('Main');
          this.props.navigation.navigate('App');
          setActive(obj.username, true);
          this.props.setUserID(obj.username);
        } else {
          this.props.navigateToRoute('Welcome');
          this.props.navigation.navigate('Auth');
        }
      })
      .catch(err => {
        handleError(err);
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

AuthLoadingScreen.propTypes = {
  setUserID: PropTypes.func.isRequired,
  navigateToRoute: PropTypes.func.isRequired
};

export default connect(null, { setUserID, navigateToRoute })(AuthLoadingScreen);
