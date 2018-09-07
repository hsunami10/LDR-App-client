import axios from 'axios';
import {
  START_LOADING,
  STOP_LOADING
} from './types';
import { ROOT_URL } from '../constants/variables';

export const startLoading = () => {
  return { type: START_LOADING };
};

export const stopLoading = () => {
  return { type: STOP_LOADING };
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
export const signUpWithUsernameAndPassword = (username, password) => {
  return dispatch => {
    axios.post(`${ROOT_URL}/api/signup/username`, { username, password })
      .then(resp => {
        console.log(resp.data);
      })
      .catch(error => {
        console.log(`signUp error: ${error}`);
      });
  };
};
