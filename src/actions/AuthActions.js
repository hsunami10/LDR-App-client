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
import { navigateToRoute, pushTabRoute } from './NavigationActions';
import { handleError } from '../assets/helpers/errors';

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
export const logOutUser = () => dispatch => {
  axios.get(`${ROOT_URL}/api/logout`, { withCredentials: true })
    .then(() => {
      dispatch({ type: LOG_OUT_USER });
    });
};

export const setAuthErrors = (screen, errorField, errorMsg, success = false) => ({
  type: SET_AUTH_ERRORS,
  payload: {
    screen,
    errorField,
    errorMsg,
    success
  }
});

export const resetAuthErrors = screen => ({
  type: RESET_AUTH_ERRORS,
  payload: screen
});

export const setNotFirstLogIn = id => dispatch => {
  (async () => {
    try {
      await Keychain.setGenericPassword(id, 'false');
    } finally {
      dispatch({ type: SET_NOT_FIRST_LOG_IN });
    }
  })().catch(error => {
    handleError(new Error(`Unable to access keychain. ${error.message}`), true);
  });
};

export const setUserCredentials = (id, firstLogin) => ({
  type: SET_USER_CREDENTIALS,
  payload: { id, firstLogin }
});

// ======================================== Forgot Password ========================================
export const forgotPassword = (email, navigation, clearInput) => dispatch => {
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/login/forgot-password`, { email })
    .then(response => {
      dispatch(stopLoading());
      if (response.data.success) {
        dispatch(setAuthErrors('forgot_password', '', response.data.msg, true));
        clearInput();
      } else if (response.data.not_verified) {
        dispatch(setAuthErrors('forgot_password', 'email', response.data.msg));
      } else {
        dispatch(setAuthErrors('forgot_password', 'email', response.data.msg));
      }
    })
    .catch(error => {
      dispatch(stopLoading());
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// Remote only
// ======================================= Logging In / Out =======================================
export const logInWithUsernameAndPassword = (userObj, navigation, resetEverything) => dispatch => {
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/login`, {
    username: userObj.username,
    password: userObj.password
  }, { withCredentials: true })
    .then(response => {
      dispatch(stopLoading());
      storeCredentials(response.data.id)
        .then(id => {
          dispatch(setUserCredentials(id, true));
          dispatch(pushTabRoute('home', null));
          navigation.navigate('App');
          resetEverything();
        })
        .catch(error => {
          handleError(new Error(`Unable to access keychain. ${error.message}`), true);
        });
    })
    .catch(error => {
      dispatch(stopLoading());
      if (error.response) {
        if (error.response.status === 401) {
          dispatch(setAuthErrors('log_in', '', 'Invalid username or password'));
        } else {
          handleError(error.response.data, false);
        }
      } else {
        handleError(error, false);
      }
    });
};

// ========================================== Signing Up ==========================================
export const sendVerificationEmail = (id, email) => dispatch => {
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/send-verification-email`, { id, email })
    .then(response => {
      dispatch(stopLoading());
      if (response.data.success) {
        dispatch(setAuthErrors('verify_email', '', response.data.msg, true));
      } else {
        dispatch(setAuthErrors('verify_email', 'email', response.data.msg));
      }
    })
    .catch(error => {
      dispatch(stopLoading());
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ======================================== Create Profile ========================================
export const createProfile = (dataObj, navigation, resetEverything) => dispatch => {
  dispatch(startLoading());

  const data = new FormData();
  data.append('user_id', dataObj.id);
  data.append('type', 'profile');
  data.append('bio', dataObj.bio);
  data.append('code', dataObj.code);
  data.append('clientImage', dataObj.clientImage);
  console.log(data);

  axios.put(`${ROOT_URL}/api/profile/create`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(() => {
      dispatch(stopLoading());
      dispatch(navigateToRoute('VerifyEmail'));
      navigation.navigate('VerifyEmail');
      resetEverything();
    })
    .catch(error => {
      dispatch(stopLoading());
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ========================================== Signing Up ==========================================
export const signUpWithUsernameAndPassword = (userObj, navigation, resetEverything) => dispatch => {
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/signup`, userObj)
    .then(response => {
      dispatch(stopLoading());
      if (response.data.msg) {
        dispatch(setAuthErrors('sign_up', 'username', response.data.msg)); // Username already taken
      } else {
        storeCredentials(response.data.id)
          .then(id => {
            startSession(userObj.username, userObj.password);
            dispatch(setUserCredentials(id, true));
            dispatch(navigateToRoute('CreateProfile'));
            navigation.navigate('CreateProfile');
            resetEverything();
          })
          .catch(error => {
            handleError(new Error(`Unable to access keychain. ${error.message}`), true);
          });
      }
    })
    .catch(error => {
      dispatch(stopLoading());
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const startSession = (username, password) => {
  axios.post(`${ROOT_URL}/api/start-session`, { username, password }, { withCredentials: true })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
