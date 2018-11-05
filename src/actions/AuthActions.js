import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  LOG_OUT_USER,
  SET_NOT_FIRST_LOG_IN,
  SET_USER_CREDENTIALS
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { setActive } from './UserActions';
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
    return Promise.reject(`Unable to access keychain. ${e.message}`);
  }
};

// Resets all app state to initial states
export const logOutUser = () => ({ type: LOG_OUT_USER });

export const setAuthErrors = (errorField, errorMsg, success = false) => ({
  type: SET_AUTH_ERRORS,
  payload: { errorField, errorMsg, success }
});

export const setNotFirstLogIn = id => dispatch => {
  (async () => {
    try {
      await Keychain.setGenericPassword(id, 'false');
    } finally {
      dispatch({ type: SET_NOT_FIRST_LOG_IN });
    }
  })().catch(error => {
    handleError(new Error(`Unable to access keychain. ${error.message}`), false);
  });
};

export const setUserCredentials = (id, firstLogin) => ({
  type: SET_USER_CREDENTIALS,
  payload: { id, firstLogin }
});

export const resetAuthErrors = () => ({ type: RESET_AUTH_ERRORS });

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
      handleError(error, false);
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
        storeCredentials(response.data.id)
          .then(id => {
            dispatch(setUserCredentials(id, true));
            dispatch(pushRoute('Main'));
            setActive(id, true);
            navigation.navigate('App');
            resetEverything();
          })
          .catch(error => {
            handleError(new Error(`Unable to access keychain. ${error.message}`), false);
          });
      }
    })
    .catch(error => {
      handleError(error, false);
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
      handleError(error, false);
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

  axios.put(`${ROOT_URL}/api/profile/create`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(() => {
      dispatch(stopLoading());
      dispatch(pushRoute('VerifyEmail'));
      navigation.navigate('VerifyEmail');
      resetEverything();
    })
    .catch(error => {
      handleError(error, false);
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
          .catch(error => {
            handleError(new Error(`Unable to access keychain. ${error.message}`), false);
          });
      }
    })
    .catch(error => {
      handleError(error, false);
    });
};
