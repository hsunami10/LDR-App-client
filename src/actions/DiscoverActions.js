import axios from 'axios';
import {
  START_INITIAL_DISCOVER_POSTS_LOADING,
  STOP_INITIAL_DISCOVER_POSTS_LOADING,
  START_DISCOVER_POSTS_REFRESHING,
  STOP_DISCOVER_POSTS_REFRESHING,
  START_INITIAL_DISCOVER_USERS_LOADING,
  STOP_INITIAL_DISCOVER_USERS_LOADING,
  START_DISCOVER_USERS_REFRESHING,
  STOP_DISCOVER_USERS_REFRESHING,
  START_INITIAL_DISCOVER_TOPICS_LOADING,
  STOP_INITIAL_DISCOVER_TOPICS_LOADING,
  START_DISCOVER_TOPICS_REFRESHING,
  STOP_DISCOVER_TOPICS_REFRESHING,
  GET_DISCOVER_POSTS,
  GET_DISCOVER_USERS,
  GET_DISCOVER_TOPICS,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { logOut, getCookie } from '../assets/helpers/authentication';

// ============================================ Posts ============================================
export const startInitialDiscoverPostsLoading = () => ({ type: START_INITIAL_DISCOVER_POSTS_LOADING });
export const stopInitialDiscoverPostsLoading = () => ({ type: STOP_INITIAL_DISCOVER_POSTS_LOADING });

export const startDiscoverPostsRefreshing = () => ({ type: START_DISCOVER_POSTS_REFRESHING });
export const stopDiscoverPostsRefreshing = () => ({ type: STOP_DISCOVER_POSTS_REFRESHING });

export const getDiscoverPosts = (userID, refresh, order, direction, lastID, lastData, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startDiscoverPostsRefreshing());
  } else if (refresh === false) {
    dispatch(startInitialDiscoverPostsLoading());
  }
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/discover/posts/${userID}?order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (refresh === true) {
            dispatch(stopDiscoverPostsRefreshing());
          } else if (refresh === false) {
            dispatch(stopInitialDiscoverPostsLoading());
          }
          if (response.data.success) {
            dispatch({
              type: GET_DISCOVER_POSTS,
              payload: response.data.result
            });
          } else {
            alertWithSingleAction(
              'Oh no!',
              response.data.message,
              () => dispatch(logOut(navigation)),
              'Log Out'
            );
          }
        })
        .catch(error => {
          if (refresh === true) {
            dispatch(stopDiscoverPostsRefreshing());
          } else if (refresh === false) {
            dispatch(stopInitialDiscoverPostsLoading());
          }
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopDiscoverPostsRefreshing());
      } else if (refresh === false) {
        dispatch(stopInitialDiscoverPostsLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ============================================ Users ============================================
export const startInitialDiscoverUsersLoading = () => ({ type: START_INITIAL_DISCOVER_USERS_LOADING });
export const stopInitialDiscoverUsersLoading = () => ({ type: STOP_INITIAL_DISCOVER_USERS_LOADING });

export const startDiscoverUsersRefreshing = () => ({ type: START_DISCOVER_USERS_REFRESHING });
export const stopDiscoverUsersRefreshing = () => ({ type: STOP_DISCOVER_USERS_REFRESHING });

export const getDiscoverUsers = (userID, refresh, order, direction, lastID, lastData, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startDiscoverUsersRefreshing());
  } else if (refresh === false) {
    dispatch(startInitialDiscoverUsersLoading());
  }
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/discover/users/${userID}?order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`)
        .then(response => {
          if (refresh === true) {
            dispatch(stopDiscoverUsersRefreshing());
          } else if (refresh === false) {
            dispatch(stopInitialDiscoverUsersLoading());
          }
          if (response.data.success) {
            dispatch({
              type: GET_DISCOVER_USERS,
              payload: response.data.result
            });
          } else {
            alertWithSingleAction(
              'Oh no!',
              response.data.message,
              () => dispatch(logOut(navigation)),
              'Log Out'
            );
          }
        })
        .catch(error => {
          if (refresh === true) {
            dispatch(stopDiscoverUsersRefreshing());
          } else if (refresh === false) {
            dispatch(stopInitialDiscoverUsersLoading());
          }
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopDiscoverUsersRefreshing());
      } else if (refresh === false) {
        dispatch(stopInitialDiscoverUsersLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};


// ============================================ Topics ============================================
export const startInitialDiscoverTopicsLoading = () => ({ type: START_INITIAL_DISCOVER_TOPICS_LOADING });
export const stopInitialDiscoverTopicsLoading = () => ({ type: STOP_INITIAL_DISCOVER_TOPICS_LOADING });

export const startDiscoverTopicsRefreshing = () => ({ type: START_DISCOVER_TOPICS_REFRESHING });
export const stopDiscoverTopicsRefreshing = () => ({ type: STOP_DISCOVER_TOPICS_REFRESHING });

export const getDiscoverTopics = (userID, refresh, order, direction, lastID, lastData, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startDiscoverTopicsRefreshing());
  } else if (refresh === false) {
    dispatch(startInitialDiscoverTopicsLoading());
  }
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/discover/topics/${userID}?order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (refresh === true) {
            dispatch(stopDiscoverTopicsRefreshing());
          } else if (refresh === false) {
            dispatch(stopInitialDiscoverTopicsLoading());
          }
          if (response.data.success) {
            dispatch({
              type: GET_DISCOVER_TOPICS,
              payload: response.data.result
            });
          } else {
            alertWithSingleAction(
              'Oh no!',
              response.data.message,
              () => dispatch(logOut(navigation)),
              'Log Out'
            );
          }
        })
        .catch(error => {
          if (refresh === true) {
            dispatch(stopDiscoverTopicsRefreshing());
          } else if (refresh === false) {
            dispatch(stopInitialDiscoverTopicsLoading());
          }
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopDiscoverTopicsRefreshing());
      } else if (refresh === false) {
        dispatch(stopInitialDiscoverTopicsLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
