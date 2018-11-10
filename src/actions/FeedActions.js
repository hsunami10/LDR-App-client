import axios from 'axios';
import {
  START_FEED_LOADING,
  STOP_FEED_LOADING,
  GET_USER_FEED,
  SORT_FEED
} from './types';
import { ROOT_URL } from '../constants/variables';
import { handleError } from '../assets/helpers';

export const startFeedLoading = () => ({ type: START_FEED_LOADING });
export const stopFeedLoading = () => ({ type: STOP_FEED_LOADING });

export const getUserFeed = (id, offset) => dispatch => {
  dispatch(startFeedLoading());
  console.log(`get user feed with id: ${id}`);
  // TODO: Implement axios API endpoint here for getting feed
  // Dispatch GET_USER_FEED action
  setTimeout(() => {
    console.log('retrieved user feed');
    dispatch(stopFeedLoading());
    dispatch({
      type: GET_USER_FEED,
      payload: []
    });
  }, 2000);
};
