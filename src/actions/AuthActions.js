import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_ID
} from './types';
import { ROOT_URL, MIN_LOADING_TIME } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { handleError } from '../assets/helpers';

// Get public or private profile information
// NOTE: Use this after valid keychain credentials or seeing public profiles
// type: private, public
export const getUserInfo = (id, type) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/api/user/${id}/${type}`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(`getUserInfo error: ${error}`);
      });
  };
};

export const setUserID = id => {
  return {
    type: SET_USER_ID,
    payload: id
  };
};

export const setAuthErrors = (errorField, errorMsg) => {
  return {
    type: SET_AUTH_ERRORS,
    payload: { errorField, errorMsg }
  };
};

export const resetAuthErrors = () => {
  return { type: RESET_AUTH_ERRORS };
};

// obj: { id, bool }
export const setActive = obj => {
  axios.put(`${ROOT_URL}/api/user/set_active`, obj)
    .catch(err => {
      handleError(err);
    });
};

const storeCredentials = (async id => {
  try {
    await Keychain.setGenericPassword(id, id);
    return Promise.resolve(id);
  } catch (e) {
    return Promise.reject(e);
  }
});

// ======================================= Logging In / Out =======================================
const logInUPResponse = (dispatch, response, navigation, resetEverything) => {
  if (response.data.msg) {
    dispatch(setAuthErrors('', response.data.msg)); // Invalid username or password
  } else {
    storeCredentials(response.data.id)
      .then(id => {
        dispatch(setUserID(id));
        navigation.navigate('App');
        setActive({ id, bool: true });
        resetEverything();
      })
      .catch(err => {
        handleError(err);
      });
  }
  dispatch(stopLoading());
};

export const logInWithUsernameAndPassword = (userObj, navigation, resetEverything) => {
  return dispatch => {
    const beforeReq = Date.now();
    dispatch(startLoading());
    axios.get(`${ROOT_URL}/api/login/${userObj.username}/${userObj.password}`)
      .then(response => {
        const diff = Date.now() - beforeReq;
        if (diff < MIN_LOADING_TIME) {
          setTimeout(
            () => logInUPResponse(dispatch, response, navigation, resetEverything),
            MIN_LOADING_TIME - diff
          );
        } else {
          logInUPResponse(dispatch, response, navigation, resetEverything);
        }
      })
      .catch(error => {
        handleError(error);
      });
  };
};

// ========================================== Signing Up ==========================================
const signUpUPResponse = (dispatch, response, navigation, resetEverything) => {
  if (response.data.msg) {
    dispatch(setAuthErrors('username', response.data.msg)); // Username already taken
  } else {
    storeCredentials(response.data.id)
      .then(id => {
        dispatch(setUserID(id));
        navigation.navigate('CreateProfile');
        setActive({ id, bool: true });
        resetEverything();
      })
      .catch(err => {
        handleError(err);
      });
  }
  dispatch(stopLoading());
};

export const signUpWithUsernameAndPassword = (userObj, navigation, resetEverything) => {
  return dispatch => {
    const beforeReq = Date.now();
    dispatch(startLoading());
    axios.post(`${ROOT_URL}/api/signup/username`, userObj)
      .then(response => {
        const diff = Date.now() - beforeReq;
        if (diff < MIN_LOADING_TIME) {
          setTimeout(
            () => signUpUPResponse(dispatch, response, navigation, resetEverything),
            MIN_LOADING_TIME - diff
          );
        } else {
          signUpUPResponse(dispatch, response, navigation, resetEverything);
        }
      })
      .catch(error => {
        handleError(error);
      });
  };
};
