import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_CREDENTIALS,
  SET_NOT_FIRST_LOG_IN
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { navigateToRoute } from './NavigationActions';
import { handleError, waitUntilMinTime } from '../assets/helpers';

// Only called when from log in / sign up screen
const storeCredentials = (async id => {
  try {
    await Keychain.setGenericPassword(id, 'true');
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

export const setUserCredentials = (id, firstLogin) => ({
  type: SET_USER_CREDENTIALS,
  payload: { id, firstLogin }
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

// Remote only
// ======================================= Logging In / Out =======================================
const logInUPResponse = ({ dispatch, response, navigation, resetEverything }) => {
  dispatch(stopLoading());
  if (response.data.msg) {
    dispatch(setAuthErrors('', response.data.msg)); // Invalid username or password
  } else {
    storeCredentials(response.data.id)
      .then(id => {
        dispatch(setUserCredentials(id, true));
        dispatch(navigateToRoute('Main'));
        setActive(id, true);
        navigation.navigate('App');
        resetEverything();
      })
      .catch(err => {
        handleError(err);
      });
  }
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
const createProfileResponse = ({ dispatch, navigation, resetEverything }) => {
  dispatch(stopLoading());
  (async () => {
    const credentials = await Keychain.getGenericPassword();
    dispatch(navigateToRoute('Main'));
    setActive(credentials.username, true);
    navigation.navigate('App');
    resetEverything();
  })().catch(error => {
    handleError(new Error(`Unable to access keychain. ${error.message}`, true));
  });
};

export const createProfile = (dataObj, navigation, resetEverything) => dispatch => {
  const beforeReq = Date.now();
  dispatch(startLoading());

  const data = new FormData();
  data.append('id', dataObj.id);
  data.append('type', dataObj.type);
  data.append('bio', dataObj.bio);
  data.append('clientImage', dataObj.clientImage);

  axios.post(`${ROOT_URL}/api/create_profile`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(() => {
      waitUntilMinTime(
        beforeReq,
        createProfileResponse,
        { dispatch, navigation, resetEverything }
      );
    })
    .catch(error => {
      handleError(error);
    });
};

const signUpUPResponse = ({ dispatch, response, navigation, resetEverything }) => {
  dispatch(stopLoading());
  if (response.data.msg) {
    dispatch(setAuthErrors('username', response.data.msg)); // Username already taken
  } else {
    storeCredentials(response.data.id)
      .then(id => {
        dispatch(setUserCredentials(id, true));
        dispatch(navigateToRoute('CreateProfile'));
        navigation.navigate('CreateProfile');
        resetEverything();
      })
      .catch(err => {
        handleError(err);
      });
  }
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
