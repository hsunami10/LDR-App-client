import axios from 'axios';
import { Alert } from 'react-native';
import {
  STORE_USER_INFO,
  RESET_USER_ERRORS,
  REMOVE_PARTNER_RESULT
} from './types';
import { ROOT_URL } from '../constants/variables';
import { removeCredentials, logOutUser } from './AuthActions';
import {
  storeUserScreenInfo,
  startUserScreenRefreshing,
  stopUserScreenRefreshing,
  startInitialUserLoading,
  stopInitialUserLoading,
} from './ScreenActions';
import { handleError } from '../assets/helpers';

export const findPartnerCode = code => dispatch => {
  console.log('TODO: Start loading, call api endpoint, check to see if code is in partners table.\nStop loading.\nIf it is, set partner_result to that. If not, set partner_result to null.');
};

export const removePartnerResult = () => ({ type: REMOVE_PARTNER_RESULT });

export const acceptResult = (userID, partnerID) => dispatch => {
  console.log('accept - add to user2_id, remove any entries where userID = user1_id');
};

/*
Get public or private user information
type: private, public, edit, partner
credentials and callbacks are only BOTH defined when called in AuthLoading
isRefresh differentiates between first load and pull to refresh load
private - must have callbacks.navToApp and callbacks.navToAuth defined
 */
export const getUserInfo = (userID, targetID, type, isRefresh, credentials = undefined, callbacks = undefined, screenID) => dispatch => {
  if (isRefresh) {
    dispatch(startUserScreenRefreshing(userID, screenID));
  } else {
    dispatch(startInitialUserLoading(userID, screenID));
  }

  // userID used for getting liked posts
  axios.get(`${ROOT_URL}/api/user/${targetID}?type=${type}&user_id=${userID}`)
    .then(response => {
      if (isRefresh) {
        dispatch(stopUserScreenRefreshing(userID, screenID));
      } else {
        dispatch(stopInitialUserLoading(userID, screenID));
      }

      if (response.data.type === 'private') {
        if (response.data.success) { // If own account exists in database
          dispatch(storeUserInfo(response.data.user));
          dispatch(storeUserScreenInfo(response.data.user, screenID));
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
                'Your account does not exist or has been deleted. If this persists, please contact the development team.',
                [{
                  text: 'OK',
                  onPress: () => {
                    if (callbacks) {
                      if (callbacks.navToAuth) {
                        dispatch(logOutUser());
                        callbacks.navToAuth();
                      } else {
                        // NOTE: This should never run
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
      } else if (response.data.type === 'public' || response.data.type === 'partner') { // User does exist - type: public / partner
        dispatch(storeUserScreenInfo(response.data.user, screenID));
      } else { // User does not exist - type: public / partner
        dispatch(storeUserScreenInfo(null, screenID));
      }
    })
    .catch(error => {
      if (isRefresh) {
        dispatch(stopUserScreenRefreshing(userID, screenID));
      } else {
        dispatch(stopInitialUserLoading(userID, screenID));
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// obj: { id, bool }
export const setActive = (id, bool) => {
  axios.put(`${ROOT_URL}/api/user/set-active`, { id, bool })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// Store user's profile information
export const storeUserInfo = user => ({
  type: STORE_USER_INFO,
  payload: user
});

export const resetUserErrors = () => ({ type: RESET_USER_ERRORS });
