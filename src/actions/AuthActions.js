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
import {
  getCredentials,
  storeUsernameCredentials,
  storeCookie,
  getCookie,
  removeCredentials,
} from '../assets/helpers/authentication';

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
      const credentials = await getCredentials();
      credentials.username.id = id;
      await Keychain.setGenericPassword(JSON.stringify(credentials.username), 'false');
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
  })
    .then(response => {
      dispatch(stopLoading());
      storeUsernameCredentials(response.data.id, '')
        .then(id => {
          logInCallback(() => {
            dispatch(setUserCredentials(id, true));
            dispatch(pushTabRoute('home', null));
            navigation.navigate('App');
            resetEverything();
          });
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

export const logInCallback = callback => {
  axios.get(`${ROOT_URL}/api/login/callback`, { withCredentials: true })
    .then(response => {
      storeCookie(response.data.cookie)
        .then(() => callback())
        .catch(error => {
          handleError(new Error(`Unable to access keychain. ${error.message}`), true);
        });
    })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// Resets all app state to initial states
export const logOutUser = () => dispatch => {
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/logout`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(() => {
          removeCredentials()
            .then(() => {
              dispatch({ type: LOG_OUT_USER });
            })
            .catch(error => {
              handleError(new Error(error.message), true);
            });
        })
        .catch(error => {
          removeCredentials()
            .then(() => {
              if (error.response) {
                handleError(error.response.data, false);
              } else {
                handleError(error, false);
              }
            })
            .catch(err => {
              handleError(new Error(err.message), true);
            });
        });
    })
    .catch(error => {
      if (error.message) {
        handleError(error, false);
      } else if (error.response && Object.keys(error.response.data).length > 0) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ========================================== Signing Up ==========================================
export const sendVerificationEmail = (id, email) => dispatch => {
  dispatch(startLoading());
  getCookie()
    .then(cookie => {
      axios.post(`${ROOT_URL}/api/send-verification-email`, { id, email }, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
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
    })
    .catch(error => {
      if (error.message) {
        handleError(error, false);
      } else if (error.response && Object.keys(error.response.data).length > 0) {
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
        storeUsernameCredentials(response.data.id, '') // Store user ID
          .then(id => {
            signUpCallback( // Start and store user session
              userObj.username,
              userObj.password,
              () => {
                dispatch(setUserCredentials(id, true));
                dispatch(navigateToRoute('CreateProfile'));
                navigation.navigate('CreateProfile');
                resetEverything();
              }
            );
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

// Only invoked on signing up, because cannot start session until there is an entry in database for the user
// Gets and stores user session cookie
export const signUpCallback = (username, password, callback) => {
  axios.post(`${ROOT_URL}/api/signup/callback`, { username, password }, { withCredentials: true })
    .then(() => logInCallback(callback))
    .catch(error => {
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

  getCookie()
    .then(cookie => {
      console.log('create profile cookie: ' + cookie);
      axios.put(`${ROOT_URL}/api/profile/create`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Cookie: cookie
        },
        withCredentials: true
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
    })
    .catch(error => {
      if (error.message) {
        handleError(error, false);
      } else if (error.response && Object.keys(error.response.data).length > 0) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
