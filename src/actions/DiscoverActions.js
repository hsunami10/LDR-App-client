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
import { logOut } from '../assets/helpers/authentication';

// ============================================ Posts ============================================
export const startInitialDiscoverPostsLoading = () => ({ type: START_INITIAL_DISCOVER_POSTS_LOADING });
export const stopInitialDiscoverPostsLoading = () => ({ type: STOP_INITIAL_DISCOVER_POSTS_LOADING });

export const startDiscoverPostsRefreshing = () => ({ type: START_DISCOVER_POSTS_REFRESHING });
export const stopDiscoverPostsRefreshing = () => ({ type: STOP_DISCOVER_POSTS_REFRESHING });

export const getDiscoverPosts = (userID, refresh, offset, order, direction, latest, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startDiscoverPostsRefreshing());
  } else if (refresh === false) {
    dispatch(startInitialDiscoverPostsLoading());
  }
  axios.get(`${ROOT_URL}/api/discover/posts/${userID}?offset=${offset}&order=${order}&direction=${direction}&latest=${latest}`)
    .then(response => {
      if (refresh === true) {
        dispatch(stopDiscoverPostsRefreshing());
      } else if (refresh === false) {
        dispatch(stopInitialDiscoverPostsLoading());
      }
      if (response.data.success) {
        dispatch({
          type: GET_DISCOVER_POSTS,
          payload: response.data.posts
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
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
};

// ============================================ Users ============================================


// ============================================ Topics ============================================
