import axios from 'axios';
import {
  STORE_USER_INFO,
  GET_USER_FRIENDS,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { removeCredentials, logOut, getCookie } from '../assets/helpers/authentication';
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

export const getUserInfo = (userID, targetID, isRefresh, screenID, currentTab, order, direction, lastID, lastData, navigation) => dispatch => {
  if (isRefresh) {
    dispatch(startUserScreenRefreshing(userID, screenID));
  } else {
    dispatch(startInitialUserLoading(userID, screenID));
  }

  getCookie()
    .then(cookie => {
      // userID used for getting liked posts
      axios.get(`${ROOT_URL}/api/user/${targetID}?user_id=${userID}&current_tab=${currentTab}&order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (isRefresh) {
            dispatch(stopUserScreenRefreshing(userID, screenID));
          } else {
            dispatch(stopInitialUserLoading(userID, screenID));
          }

          // If own account
          if (userID === targetID) {
            if (response.data.success) { // If own account exists in database
              dispatch(storeUserInfo(response.data.user));
              dispatch(storeUserScreenInfoSuccess(response.data.user, screenID));
            } else { // If own account does not exist in database, then log out to Welcome screen
              removeCredentials()
                .then(() => {
                  alertWithSingleAction(
                    'Oh no!',
                    'Your account does not exist or has been deleted. If this persists, please contact the development team.',
                    () => dispatch(logOut(navigation)),
                    'Log Out'
                  );
                })
                .catch(error => {
                  handleError(new Error(error.message), true);
                });
            }
          } else if (response.data.success) {
            dispatch(storeUserScreenInfoSuccess(response.data.user, screenID));
          } else if (isRefresh) {
              alertWithSingleAction(
                'Oh no!',
                response.data.message
              );
          } else {
            dispatch(storeUserScreenInfoFailure(targetID, screenID));
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
    });
};

// loading = null and screenID = null in SocialScreen
// loading != null and screenID != null in ViewProfileScreen
export const getFriends = (userID, targetID, order, direction, lastID, lastData, navigation, loading = null, screenID = null) => dispatch => {
  if (loading === true) {
    // TODO: Dispatch initial loading for ViewProfileScreen - ScreenReducer.profiles.friends
  }
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/user/get-friends/${targetID}?user_id=${userID}&order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (response.data.success) {
            if (screenID) { // If in ViewProfileScreen
              // TODO: Dispatch a screen reducer action here to update friends prop in ScreenReducer.profiles
            } else { // If in SocialScreen
              dispatch({
                type: GET_USER_FRIENDS,
                payload: response.data.friends
              });
            }
          } else if (userID === targetID) {
            alertWithSingleAction(
              'Oh no!',
              response.data.message,
              () => dispatch(logOut(navigation)),
              'Log Out'
            );
          } else {
            alertWithSingleAction(
              'Oh no!',
              response.data.message
            );
          }
        })
        .catch(error => {
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
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
