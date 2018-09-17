import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_ID
} from './types';
import { ROOT_URL, MIN_LOADING_TIME } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { handleError, waitUntilMinTime } from '../assets/helpers';

const storeCredentials = (async id => {
  try {
    await Keychain.setGenericPassword(id, id);
    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(e);
  }
});

// Get public or private profile information
// NOTE: Use this after valid keychain credentials or seeing public profiles
// type: private, public
export const getUserInfo = (id, type) => dispatch => {
  axios.get(`${ROOT_URL}/api/user/${id}/${type}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(`getUserInfo error: ${error}`);
    });
};

export const setAuthErrors = (errorField, errorMsg, success = false) => ({
  type: SET_AUTH_ERRORS,
  payload: { errorField, errorMsg, success }
});

export const resetAuthErrors = () => ({ type: RESET_AUTH_ERRORS });

export const setUserID = id => ({
  type: SET_USER_ID,
  payload: id
});

// obj: { id, bool }
export const setActive = (id, bool) => {
  axios.put(`${ROOT_URL}/api/user/set_active`, { id, bool })
    .catch(err => {
      handleError(err);
    });
};

// ======================================== Forgot Password ========================================
const handleForgotPassword = ({ dispatch, response, navigation, clearInput }) => {
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
  dispatch(stopLoading());
};

export const forgotPassword = (email, navigation, clearInput) => dispatch => {
  const beforeReq = Date.now();
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/login/forgot_password`, { email })
    .then(response => {
      waitUntilMinTime(
        beforeReq,
        handleForgotPassword,
        { dispatch, response, navigation, clearInput }
      );
    })
    .catch(error => {
      handleError(error);
    });
};

// ======================================= Logging In / Out =======================================
const logInUPResponse = ({ dispatch, response, navigation, resetEverything }) => {
  if (response.data.msg) {
    dispatch(setAuthErrors('', response.data.msg)); // Invalid username or password
  } else {
    storeCredentials(response.data.id)
      .then(id => {
        dispatch(setUserID(id));
        navigation.navigate('App');
        setActive(id, true);
        resetEverything();
      })
      .catch(err => {
        handleError(err);
      });
  }
  dispatch(stopLoading());
};

export const logInWithUsernameAndPassword = (userObj, navigation, resetEverything) => dispatch => {
  const beforeReq = Date.now();
  dispatch(startLoading());
  axios.get(`${ROOT_URL}/api/login/${userObj.username}/${userObj.password}`)
    .then(response => {
      waitUntilMinTime(
        beforeReq,
        logInUPResponse,
        { dispatch, response, navigation, resetEverything }
      );
    })
    .catch(error => {
      handleError(error);
    });
};

// ========================================== Signing Up ==========================================
const signUpUPResponse = ({ dispatch, response, navigation, resetEverything }) => {
  if (response.data.msg) {
    dispatch(setAuthErrors('username', response.data.msg)); // Username already taken
  } else {
    storeCredentials(response.data.id)
      .then(id => {
        dispatch(setUserID(id));
        navigation.navigate('CreateProfile');
        setActive(id, true);
        resetEverything();
      })
      .catch(err => {
        handleError(err);
      });
  }
  dispatch(stopLoading());
};

export const signUpWithUsernameAndPassword = (userObj, navigation, resetEverything) => dispatch => {
  const beforeReq = Date.now();
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/signup/username`, userObj)
    .then(response => {
      waitUntilMinTime(
        beforeReq,
        signUpUPResponse,
        { dispatch, response, navigation, resetEverything }
      );
    })
    .catch(error => {
      handleError(error);
    });
};
