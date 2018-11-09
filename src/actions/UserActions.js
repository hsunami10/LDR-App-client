import axios from 'axios';
import { Alert } from 'react-native';
import {
  START_USER_LOADING,
  STOP_USER_LOADING,
  SET_SELECTED_USER,
  STORE_USER_INFO,
  FETCH_ALIASES
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { removeCredentials } from './AuthActions';
import { pushRoute } from './NavigationActions';
import { handleError } from '../assets/helpers';

// Loading only for profile screens and anything user-related
const startUserLoading = () => ({ type: START_USER_LOADING });
const stopUserLoading = () => ({ type: STOP_USER_LOADING });

/*
Get public or private user information
type: private, public, edit, partner
credentials and callbacks are only BOTH defined when called in AuthLoading
isRefresh differentiates between first load and pull to refresh load
private - must have callbacks.navToApp and callbacks.navToAuth defined
 */
export const getUserInfo = (id, type, isRefresh, credentials = undefined, callbacks = undefined) => dispatch => {
  if (isRefresh) {
    dispatch(startUserLoading());
  } else {
    dispatch(startLoading());
  }

  axios.get(`${ROOT_URL}/api/user/${id}?type=${type}`)
    .then(response => {
      if (isRefresh) {
        dispatch(stopUserLoading());
      } else {
        dispatch(stopLoading());
      }

      if (response.data.type === 'private') {
        if (response.data.success) { // If own account exists in database
          dispatch(storeUserInfo(response.data.user));
          if (callbacks) {
            if (callbacks.navToApp) {
              callbacks.navToApp();
            } else {
              handleError(new Error('navToApp does not exist in callbacks param in getUserInfo'), true);
            }
          }
        } else { // If own account does not exist in database, then log out to Welcome screen
          removeCredentials()
            .then(() => {
              Alert.alert(
                'Oh no!',
                'Your account does not exist. If this persists, please contact the development team.',
                [{
                  text: 'OK',
                  onPress: () => {
                    if (callbacks) {
                      if (callbacks.navToAuth) {
                        callbacks.navToAuth();
                      } else {
                        handleError(new Error('navToAuth does not exist in callbacks param in getUserInfo'), true);
                      }
                    }
                  }
                }],
                { cancelable: false }
              );
            })
            .catch(error => {
              handleError(new Error(`Unable to access keychain. ${error.message}`), false);
            });
        }
      } else if (response.data.type === 'edit') {
        // TODO: Handle retriving data for editing profile
        console.log('retrieve data to edit profile here');
      } else if (response.data.success) { // User does exist - type: public / partner
        dispatch(setSelectedUser(response.data.user));
      } else { // User does not exist - type: public / partner
        dispatch(setSelectedUser(null));
      }
    })
    .catch(error => {
      handleError(error, false);
    });
};

// obj: { id, bool }
export const setActive = (id, bool) => {
  axios.put(`${ROOT_URL}/api/user/set-active`, { id, bool })
    .catch(error => {
      handleError(error, false);
    });
};

// Store user's profile information
export const storeUserInfo = user => ({
  type: STORE_USER_INFO,
  payload: user
});

export const setSelectedUser = user => ({
  type: SET_SELECTED_USER,
  payload: user
});

// Navigate to CreateMainScreen after aliases are loaded
export const fetchAliases = (id, navigation) => dispatch => {
  dispatch(startLoading());

  axios.get(`${ROOT_URL}/api/user/alias/${id}`)
    .then(response => {
      dispatch(stopLoading());
      dispatch({
        type: FETCH_ALIASES,
        payload: response.data
      });
      dispatch(pushRoute('Create'));
      navigation.navigate('Create');
    })
    .catch(error => {
      handleError(error, false);
    });
};
