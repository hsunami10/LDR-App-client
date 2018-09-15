import axios from 'axios';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  LOG_IN_USERNAME_AND_PASSWORD_SUCCESS,
  SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS
} from './types';
import { ROOT_URL, MIN_LOADING_TIME } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { handleError } from '../assets/helpers';

// Get public or private profile information
// NOTE: Use this after valid keychain crednetials or seeing public profiles
export const getUserInfo = (uid, type) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/api/user/${uid}/${type}`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(`getUserInfo error: ${error}`);
      });
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

// ======================================= Logging In / Out =======================================
const logInUPResponse = (dispatch, response, navigation, resetEverything) => {
  if (response.data.msg) {
    dispatch(setAuthErrors('username', response.data.msg)); // Username does not exist
  } else {
    dispatch({
      type: LOG_IN_USERNAME_AND_PASSWORD_SUCCESS,
      payload: response.data // user object
    });
    // TODO: Store into keychain
    navigation.navigate('App');
    resetEverything();
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
    dispatch({
      type: SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS,
      payload: response.data.id
    });
    // TODO: Store into keychain
    navigation.navigate('CreateProfile');
    resetEverything();
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
