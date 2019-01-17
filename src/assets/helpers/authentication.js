import * as Keychain from 'react-native-keychain';
import CookieManager from 'react-native-cookies';
import { logOutUser } from '../../actions/AuthActions';
import { navigateToRoute } from '../../actions/NavigationActions';

// Helper function to handle logging out all users
export const logOut = navigation => dispatch => {
  dispatch(logOutUser());
  dispatch(navigateToRoute('Welcome'));
  navigation.navigate('Welcome');
};

// Only called when from log in / sign up screen
export const storeUsernameCredentials = async (id, cookieStr) => {
  try {
    await Keychain.setGenericPassword(JSON.stringify({ id, cookie: cookieStr }), 'true');
    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const getCredentials = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      const username = JSON.parse(credentials.username);
      credentials.username = username;
      return Promise.resolve(credentials);
    }
    return Promise.resolve(false);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const removeCredentials = async () => {
  try {
    await Keychain.resetGenericPassword();
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(`Unable to access keychain. ${e.message}`);
  }
};

export const storeCookie = async cookieStr => {
  try {
    const credentials = await getCredentials();
    if (credentials) {
      credentials.username.cookie = cookieStr;
      await Keychain.setGenericPassword(JSON.stringify(credentials.username), credentials.password);
      return Promise.resolve();
    }
    throw new Error('No credentials available to store cookies.');
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getCookie = async () => {
  try {
    const credentials = await getCredentials();
    if (credentials) {
      await CookieManager.clearAll();
      return Promise.resolve(credentials.username.cookie);
    }
    throw new Error('User session cookie not found in keychain, or credentials not found.');
  } catch (error) {
    return Promise.reject(error);
  }
};
