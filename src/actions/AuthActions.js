import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { Alert } from 'react-native';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_CREDENTIALS,
  SET_NOT_FIRST_LOG_IN,
  STORE_USER_INFO,
  START_USER_LOADING,
  STOP_USER_LOADING,
  SET_SELECTED_USER
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { pushRoute } from './NavigationActions';
import { handleError } from '../assets/helpers';

// Only called when from log in / sign up screen
export const storeCredentials = async id => {
  try {
    await Keychain.setGenericPassword(id, 'true');
    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(e);
  }
};

export const removeCredentials = async () => {
  try {
    await Keychain.resetGenericPassword();
    return Promise.resolve();
  } catch (e) {
    return Promise.reject(e);
  }
};

export const startUserLoading = () => ({ type: START_USER_LOADING });
export const stopUserLoading = () => ({ type: STOP_USER_LOADING });

/*
Get public or private profile information
type: private, public
credentials and callbacks are only BOTH defined when called in AuthLoading
isRefresh differentiates between first load and pull to refresh load
 */
export const getUserInfo = (id, type, isRefresh, credentials = undefined, callbacks = undefined) => dispatch => {
  // If not called from AuthLoading
  if (!credentials || !callbacks) {
    if (isRefresh) {
      dispatch(startUserLoading());
    } else {
      dispatch(startLoading());
    }
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
          if (callbacks && credentials) { // AuthLoading screen only
            if (callbacks.navToApp) {
              callbacks.navToApp(credentials);
            } else {
              handleError(new Error('navToApp does not exist in callbacks param in getUserInfo'));
            }
          } else if (callbacks) {
            if (callbacks.navToApp) {
              callbacks.navToApp();
            } else {
              handleError(new Error('navToApp does not exist in callbacks param in getUserInfo'));
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
                        handleError(new Error('navToAuth does not exist in callbacks param in getUserInfo'));
                      }
                    }
                  }
                }],
                { cancelable: false }
              );
            })
            .catch(error => {
              handleError(error);
            });
        }
      } else if (response.data.type === 'public') {
        if (response.data.success) { // If user does exist
          dispatch(setSelectedUser(response.data.user));
        } else { // If user does not exist
          dispatch(setSelectedUser(null));
        }
      }
    })
    .catch(error => {
      handleError(error);
    });
};

// Store user's profile information
export const storeUserInfo = user => ({
  type: STORE_USER_INFO,
  payload: user
});

export const setAuthErrors = (errorField, errorMsg, success = false) => ({
  type: SET_AUTH_ERRORS,
  payload: { errorField, errorMsg, success }
});

export const resetAuthErrors = () => ({ type: RESET_AUTH_ERRORS });

export const setUserCredentials = (id, firstLogin) => ({
  type: SET_USER_CREDENTIALS,
  payload: { id, firstLogin }
});

export const setSelectedUser = user => ({
  type: SET_SELECTED_USER,
  payload: user
});

export const setNotFirstLogIn = id => dispatch => {
  (async () => {
    try {
      await Keychain.setGenericPassword(id, 'false');
    } finally {
      dispatch({ type: SET_NOT_FIRST_LOG_IN });
    }
  })().catch(err => {
    handleError(err);
  });
};

// obj: { id, bool }
export const setActive = (id, bool) => {
  axios.put(`${ROOT_URL}/api/user/set-active`, { id, bool })
    .catch(err => {
      handleError(err);
    });
};

// ======================================== Forgot Password ========================================
export const forgotPassword = (email, navigation, clearInput) => dispatch => {
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/login/forgot-password`, { email })
    .then(response => {
      dispatch(stopLoading());
      if (response.data.success) {
        dispatch(setAuthErrors('', response.data.msg, true));
        clearInput();
      } else if (response.data.not_verified) {
        // TODO: Ask use if they want to verify their email
        // QUESTION: Should we do this? Security issues...
        // If yes, then navigate to email verification screen
        dispatch(setAuthErrors('username', response.data.msg));
      } else {
        dispatch(setAuthErrors('username', response.data.msg));
      }
    })
    .catch(error => {
      handleError(error);
    });
};

// Remote only
// ======================================= Logging In / Out =======================================
export const logInWithUsernameAndPassword = (userObj, navigation, resetEverything) => dispatch => {
  dispatch(startLoading());
  axios.get(`${ROOT_URL}/api/login/${userObj.username}/${userObj.password}`)
    .then(response => {
      dispatch(stopLoading());
      if (response.data.msg) {
        dispatch(setAuthErrors('', response.data.msg)); // Invalid username or password
      } else {
        storeCredentials(response.data.user.id)
          .then(id => {
            dispatch(setUserCredentials(id, true));
            dispatch(storeUserInfo(response.data.user));
            dispatch(pushRoute('Main'));
            setActive(id, true);
            navigation.navigate('App');
            resetEverything();
          })
          .catch(err => {
            handleError(err);
          });
      }
    })
    .catch(error => {
      handleError(error);
    });
};

// ========================================== Signing Up ==========================================
export const sendVerificationEmail = (id, email) => dispatch => {
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/send-verification-email`, { id, email })
    .then(response => {
      dispatch(stopLoading());
      if (response.data.success) {
        dispatch(setAuthErrors('', response.data.msg, true));
      } else {
        dispatch(setAuthErrors('username', response.data.msg));
      }
    })
    .catch(error => {
      handleError(error);
    });
};

// ======================================== Create Profile ========================================
export const createProfile = (dataObj, navigation, resetEverything) => dispatch => {
  dispatch(startLoading());

  const data = new FormData();
  data.append('user_id', dataObj.id);
  data.append('type', 'profile');
  data.append('bio', dataObj.bio);
  data.append('clientImage', dataObj.clientImage);
  console.log(data);

  axios.post(`${ROOT_URL}/api/create-profile`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(() => {
      dispatch(stopLoading());
      dispatch(pushRoute('VerifyEmail'));
      navigation.navigate('VerifyEmail');
      resetEverything();
    })
    .catch(error => {
      handleError(error);
    });
};

// ========================================== Signing Up ==========================================
export const signUpWithUsernameAndPassword = (userObj, navigation, resetEverything) => dispatch => {
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/signup/username`, userObj)
    .then(response => {
      dispatch(stopLoading());
      if (response.data.msg) {
        dispatch(setAuthErrors('username', response.data.msg)); // Username already taken
      } else {
        storeCredentials(response.data.id)
          .then(id => {
            dispatch(setUserCredentials(id, true));
            dispatch(pushRoute('CreateProfile'));
            navigation.navigate('CreateProfile');
            resetEverything();
          })
          .catch(err => {
            handleError(err);
          });
      }
    })
    .catch(error => {
      handleError(error);
    });
};
