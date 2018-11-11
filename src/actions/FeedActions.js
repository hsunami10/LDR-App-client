import axios from 'axios';
import {
  START_FEED_LOADING,
  STOP_FEED_LOADING,
  START_INITIAL_FEED_LOADING,
  STOP_INITIAL_FEED_LOADING,
  GET_USER_FEED,
  SORT_FEED
} from './types';
import { ROOT_URL } from '../constants/variables';
import { handleError } from '../assets/helpers';

export const startFeedLoading = () => ({ type: START_FEED_LOADING });
export const stopFeedLoading = () => ({ type: STOP_FEED_LOADING });

// Dispatched only on feed first load
export const startInitialFeedLoading = () => ({ type: START_INITIAL_FEED_LOADING });
export const stopInitialFeedLoading = () => ({ type: STOP_INITIAL_FEED_LOADING });

export const getUserFeed = (id, offset, initialFetch) => dispatch => {
  if (initialFetch) {
    dispatch(startInitialFeedLoading());
  } else {
    dispatch(startFeedLoading());
  }

  const direction = 'DESC';
  const order = 'date_posted';
  const latestDate = Math.floor(Date.now() / 1000); // TODO: Change this into a parameter passed down of the date_posted of topmost post
  // TODO: Change order and direction according to sort by action - instead of hardcoding
  axios.get(`${ROOT_URL}/api/feed/${id}?offset=${offset}&order=${order}&direction=${direction}&latestDate=${latestDate}`)
    .then(response => {
      if (initialFetch) {
        dispatch(stopInitialFeedLoading());
      } else {
        dispatch(stopFeedLoading());
      }
      dispatch({
        type: GET_USER_FEED,
        payload: {
          offset: offset === 0 ? response.data.length : offset + response.data.length,
          posts: response.data
        }
      });
    })
    .catch(error => {
      if (initialFetch) {
        dispatch(stopInitialFeedLoading());
      } else {
        dispatch(stopFeedLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
