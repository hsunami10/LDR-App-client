import axios from 'axios';
import {
  START_OVERLAY_LOADING,
  STOP_OVERLAY_LOADING,
  SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS
} from './types';
import { ROOT_URL, MIN_LOADING_TIME } from '../constants/variables';

export const startLoading = () => {
  return { type: START_OVERLAY_LOADING };
};

export const stopLoading = () => {
  return { type: STOP_OVERLAY_LOADING };
};

// Get public or private profile information
// NOTE: Use this after valid keychain crednetials or seeing public profiles
export const getUserInfo = (uid, type) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/api/user/${uid}/${type}`)
      .then(resp => {
        console.log(resp.data);
      })
      .catch(error => {
        console.log(`getUserInfo error: ${error}`);
      });
  };
};

// QUESTION: Best place to initialize socket connection? In App.js constructor?
export const initSocket = uid => {

};

// ======================================= Logging In / Out =======================================
export const logIn = (username, password) => {
  return dispatch => {
    axios.get(`${ROOT_URL}/api/login/${username}/${password}`)
      .then(resp => {
        console.log(resp.data);
      })
      .catch(error => {
        console.log(`logIn error: ${error}`);
      });
  };
};

// ========================================== Signing Up ==========================================
const handleUPResponse = (dispatch, resp) => {
  if (resp.data.msg) {
    // TODO: Handle username already taken message here
    console.log(resp.data.msg);
  } else {
    // TODO: Handle sign up username and password success
    dispatch({
      type: SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS,
      payload: resp.data.id
    });
    dispatch(stopLoading());
  }
};

// NOTE: Have loading be ALWAYS AT LEAST 1 second
export const signUpWithUsernameAndPassword = (username, password) => {
  return dispatch => {
    const beforeReq = Date.now();
    dispatch(startLoading());
    axios.post(`${ROOT_URL}/api/signup/username`, { username, password })
      .then(resp => {
        const diff = Date.now() - beforeReq;
        if (diff < MIN_LOADING_TIME) {
          setTimeout(() => handleUPResponse(dispatch, resp), MIN_LOADING_TIME - diff);
        } else {
          handleUPResponse(dispatch, resp);
        }
      })
      .catch(error => {
        console.log(`signUp error: ${error}`);
        console.log(error.status);
        dispatch(stopLoading());
      });
  };
};
