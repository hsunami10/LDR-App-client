import axios from 'axios';
import {
  STORE_USER_INFO,
  RESET_USER_ERRORS,
  STORE_PARTNER_RESULT_SUCCESS,
  STORE_PARTNER_RESULT_FAILURE,
  REMOVE_PARTNER_RESULT,
  ACCEPT_PARTNER_RESULT_SUCCESS,
  ACCEPT_PARTNER_RESULT_FAILURE,
  START_FIND_PARTNER_LOADING,
  STOP_FIND_PARTNER_LOADING,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { removeCredentials, logOutUser } from './AuthActions';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import {
  storeUserScreenInfoSuccess,
  storeUserScreenInfoFailure,
  startUserScreenRefreshing,
  stopUserScreenRefreshing,
  startInitialUserLoading,
  stopInitialUserLoading,
} from './ScreenActions';
import { handleError } from '../assets/helpers/errors';

// If screenID is null, then only change state in UserReducer
// If screenID is NOT null, then only change state in ScreenReducer
export const startFindPartnerLoading = screenID => ({
  type: START_FIND_PARTNER_LOADING,
  payload: screenID
});
export const stopFindPartnerLoading = screenID => ({
  type: STOP_FIND_PARTNER_LOADING,
  payload: screenID
});

export const findPartnerCode = (code, screenID = null) => dispatch => {
  dispatch(startFindPartnerLoading(screenID));
  axios.get(`${ROOT_URL}/api/partner/find-code/${code}`)
    .then(response => {
      dispatch(stopFindPartnerLoading(screenID));
      if (response.data.success) {
        dispatch({
          type: STORE_PARTNER_RESULT_SUCCESS,
          payload: response.data.user
        });
      } else {
        dispatch({ type: STORE_PARTNER_RESULT_FAILURE });
      }
    })
    .catch(error => {
      dispatch(stopFindPartnerLoading(screenID));
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const removePartnerResult = () => ({ type: REMOVE_PARTNER_RESULT });

export const acceptResult = (userID, partnerID, screenID = null) => dispatch => {
  console.log('accept - add to user2_id, remove any entries where userID = user1_id');

  dispatch(startFindPartnerLoading(screenID));
  axios.put(`${ROOT_URL}/api/partner/accept`, { userID, partnerID })
    .then(response => {
      dispatch(stopFindPartnerLoading(screenID));
      if (response.data.success) {
        // TODO: Finish this later - add response.data.partner to global redux state
        dispatch({
          type: ACCEPT_PARTNER_RESULT_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: ACCEPT_PARTNER_RESULT_FAILURE,
          payload: response.data.error
        });
      }
    })
    .catch(error => {
      dispatch(stopFindPartnerLoading(screenID));
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

/*
Get public or private user information
type: private, public, edit, partner
isRefresh differentiates between first load and pull to refresh load
private - must have callbacks.navToApp and callbacks.navToAuth defined
 */
export const getUserInfo = (userID, targetID, type, isRefresh, callbacks = null, screenID) => dispatch => {
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

      // If own account
      if (response.data.type === 'private') {
        if (response.data.success) { // If own account exists in database
          dispatch(storeUserInfo(response.data.user));
          dispatch(storeUserScreenInfoSuccess(response.data.user, screenID));
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
              alertWithSingleAction(
                'Oh no!',
                'Your account does not exist or has been deleted. If this persists, please contact the development team.',
                () => {
                  if (callbacks) {
                    if (callbacks.navToAuth) {
                      dispatch(logOutUser());
                      callbacks.navToAuth();
                    } else {
                      // NOTE: This should never run
                      handleError(new Error('navToAuth does not exist in callbacks param in getUserInfo'), true);
                    }
                  }
                },
                undefined,
                false
              );
            })
            .catch(error => {
              handleError(new Error(error.message), true);
            });
        }
      } else if (response.data.type === 'public') {
        if (response.data.success) {
          dispatch(storeUserScreenInfoSuccess(response.data.user, screenID));
        } else if (isRefresh) {
          alertWithSingleAction(
            'Oh no!',
            response.data.error,
            () => {
              if (callbacks.noUserCB) {
                callbacks.noUserCB();
              }
            });
        } else {
          dispatch(storeUserScreenInfoFailure(targetID, screenID));
        }
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

// Store user's profile information
export const storeUserInfo = user => ({
  type: STORE_USER_INFO,
  payload: user
});

export const resetUserErrors = () => ({ type: RESET_USER_ERRORS });
