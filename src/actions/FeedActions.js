import axios from 'axios';
import {
  START_FEED_LOADING,
  STOP_FEED_LOADING,
  START_INITIAL_FEED_LOADING,
  STOP_INITIAL_FEED_LOADING,
  GET_USER_FEED,
  // SORT_FEED
} from './types';
import { ROOT_URL } from '../constants/variables';
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { logOut, getCookie } from '../assets/helpers/authentication';

export const startFeedLoading = () => ({ type: START_FEED_LOADING });
export const stopFeedLoading = () => ({ type: STOP_FEED_LOADING });

// Dispatched only on feed first load
export const startInitialFeedLoading = () => ({ type: START_INITIAL_FEED_LOADING });
export const stopInitialFeedLoading = () => ({ type: STOP_INITIAL_FEED_LOADING });

export const getUserFeed = (id, refresh, order, direction, lastID, lastData, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startFeedLoading());
  } else if (refresh === false) {
    dispatch(startInitialFeedLoading());
  }

  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/feed/${id}?order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (refresh === true) {
            dispatch(stopFeedLoading());
          } else if (refresh === false) {
            dispatch(stopInitialFeedLoading());
          }
          if (response.data.success) {
            dispatch({
              type: GET_USER_FEED,
              payload: response.data.feed
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
            dispatch(stopFeedLoading());
          } else if (refresh === false) {
            dispatch(stopInitialFeedLoading());
          }
          if (error.message) {
            handleError(error, false);
          } else if (error.response && Object.keys(error.response.data).length > 0) {
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
