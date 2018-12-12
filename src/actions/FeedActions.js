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
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';

export const startFeedLoading = () => ({ type: START_FEED_LOADING });
export const stopFeedLoading = () => ({ type: STOP_FEED_LOADING });

// Dispatched only on feed first load
export const startInitialFeedLoading = () => ({ type: START_INITIAL_FEED_LOADING });
export const stopInitialFeedLoading = () => ({ type: STOP_INITIAL_FEED_LOADING });

export const getUserFeed = (id, offset, refresh, order, direction, latestDate, noUserCB) => dispatch => {
  if (refresh === true) {
    dispatch(startFeedLoading());
  } else if (refresh === false) {
    dispatch(startInitialFeedLoading());
  }

  axios.get(`${ROOT_URL}/api/feed/${id}?offset=${offset}&order=${order}&direction=${direction}&latest_date=${latestDate}`)
    .then(response => {
      if (refresh === true) {
        dispatch(stopFeedLoading());
      } else if (refresh === false) {
        dispatch(stopInitialFeedLoading());
      }
      if (response.data.success) {
        const { feed } = response.data;
        dispatch({
          type: GET_USER_FEED,
          payload: {
            offset: offset === 0 ? feed.order.length : offset + feed.order.length,
            post_likes: feed.post_likes,
            order: feed.order,
            posts: feed.posts,
            replace: offset === 0 // Flag: replace or add to posts array
          }
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          noUserCB,
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
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
