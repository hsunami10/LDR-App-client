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

export const getUserFeed = (id, offset, refresh, order, direction, latestDate) => dispatch => {
  if (refresh === true) {
    dispatch(startFeedLoading());
  } else if (refresh === false) {
    dispatch(startInitialFeedLoading());
  }
  // If initialFetch === null, then don't load (only when paging)

  // TODO: Change order and direction according to sort by action - instead of hardcoding
  axios.get(`${ROOT_URL}/api/feed/${id}?offset=${offset}&order=${order}&direction=${direction}&latest_date=${latestDate}`)
    .then(response => {
      if (refresh === true) {
        dispatch(stopFeedLoading());
      } else if (refresh === false) {
        dispatch(stopInitialFeedLoading());
      }
      dispatch({
        type: GET_USER_FEED,
        payload: {
          offset: offset === 0 ? response.data.order.length : offset + response.data.order.length,
          post_likes: response.data.post_likes,
          order: response.data.order,
          posts: response.data.posts,
          replace: offset === 0 // Flag: replace or add to posts array
        }
      });
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopFeedLoading());
      } else if (refresh === false) {
        dispatch(stopInitialFeedLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
