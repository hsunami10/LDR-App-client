import axios from 'axios';
import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
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
export const logIn = (username, password) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/api/login/${username}/${password}`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(`logIn error: ${error}`);
      });
  };
};

// ========================================== Signing Up ==========================================
const handleUPResponse = (dispatch, response, navigation) => {
  if (response.data.msg) {
    dispatch(setAuthErrors('username', response.data.msg));
  } else {
    dispatch({
      type: SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS,
      payload: response.data.id
    });
    // TODO: Call navigation.navigate('route') here - also resets auth errors
  }
  dispatch(stopLoading());
};

// NOTE: Have loading be ALWAYS AT LEAST 1 second
export const signUpWithUsernameAndPassword = (username, password, navigation) => {
  return dispatch => {
    const beforeReq = Date.now();
    dispatch(startLoading());
    axios.post(`${ROOT_URL}/api/signup/username`, { username, password })
      .then(response => {
        const diff = Date.now() - beforeReq;
        if (diff < MIN_LOADING_TIME) {
          setTimeout(
            () => handleUPResponse(dispatch, response, navigation),
            MIN_LOADING_TIME - diff
          );
        } else {
          handleUPResponse(dispatch, response, navigation);
        }
      })
      .catch(error => {
        handleError(error);
      });
  };
};
