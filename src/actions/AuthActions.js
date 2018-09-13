import axios from 'axios';
import {
  SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS
} from './types';
import { ROOT_URL, MIN_LOADING_TIME } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import handleError from '../assets/error';

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
    // TODO: Handle username already taken message here
    // Change input border to red, show text message on screen
    console.log(response.data.msg);
  } else {
    // TODO: Handle sign up username and password success
    dispatch({
      type: SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS,
      payload: response.data.id
    });
    // TODO: Call navigation.navigate('route') here
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
