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

  console.log(`get user feed with id: ${id}`);
  // TODO: Implement axios API endpoint here for getting feed
  // Dispatch GET_USER_FEED action
  setTimeout(() => {
    console.log('retrieved user feed');
    if (initialFetch) {
      dispatch(stopInitialFeedLoading());
    } else {
      dispatch(stopFeedLoading());
    }
    dispatch({
      type: GET_USER_FEED,
      payload: []
    });
  }, 2000);
};
