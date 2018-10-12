import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import { Alert } from 'react-native';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_CREDENTIALS,
  SET_NOT_FIRST_LOG_IN,
  STORE_USER_INFO
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { pushRoute } from './NavigationActions';
import { handleError, waitUntilMinTime } from '../assets/helpers';

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

export const checkUserExists = (credentials, navToApp, navToAuth) => dispatch => {
  console.log('check');
  axios.get(`${ROOT_URL}/api/user/check/${credentials.username}`)
    .then(response => {
      console.log(response.data);
      if (response.data.success) { // If user exists in database
        dispatch(storeUserInfo(response.data.user));
        navToApp(credentials);
      } else { // If user does not exist in database
        removeCredentials()
          .then(() => {
            Alert.alert(
              'Oh no!',
              'Your account does not exist. If this persists, please contact the development team.',
              {
                text: 'OK', onPress: navToAuth()
              }
            );
          })
          .catch(error => {
            handleError(error);
          });
      }
    })
    .catch(error => {
      handleError(error);
    });
};

// Get public or private profile information
// NOTE: Use this after valid keychain credentials or seeing public profiles
// type: private, public
export const getUserInfo = (id, type) => dispatch => {
  axios.get(`${ROOT_URL}/api/user/${id}/?type=${type}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log(`getUserInfo error: ${error}`);
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
  axios.post(`${ROOT_URL}/api/login/forgot-password`, { email })
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
        dispatch(pushRoute('Main'));
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
const createProfileResponse = ({ dispatch, navigation, resetEverything }) => {
  dispatch(stopLoading());
  dispatch(pushRoute('VerifyEmail'));
  navigation.navigate('VerifyEmail');
  resetEverything();
};

export const createProfile = (dataObj, navigation, resetEverything) => dispatch => {
  const beforeReq = Date.now();
  dispatch(startLoading());

  const data = new FormData();
  data.append('user_id', dataObj.id);
  data.append('type', 'profile');
  data.append('bio', dataObj.bio);
  data.append('clientImage', dataObj.clientImage);

  axios.post(`${ROOT_URL}/api/create-profile`, data, {
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

// ========================================== Signing Up ==========================================
const signUpUPResponse = ({ dispatch, response, navigation, resetEverything }) => {
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
