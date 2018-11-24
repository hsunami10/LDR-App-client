import axios from 'axios';
import {
  DELETE_COMMENT,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { handleError } from '../assets/helpers';
import {
  startCommentsPageLoading,
  startInitialCommentsLoading,
  stopCommentsPageLoading,
  stopInitialCommentsLoading,
  storeCommentsScreenInfo
} from './ScreenActions';

export const getComments = (userID, postID, screenID, paging, offset, latestDate) => dispatch => {
  if (paging) {
    dispatch(startCommentsPageLoading(postID, screenID));
  } else {
    dispatch(startInitialCommentsLoading(postID, screenID));
  }
  axios.get(`${ROOT_URL}/api/comments/${userID}?offset=${offset}&latest_date=${latestDate}&post_id=${postID}`)
    .then(response => {
      if (paging) {
        dispatch(stopCommentsPageLoading(postID, screenID));
      } else {
        dispatch(stopInitialCommentsLoading(postID, screenID));
      }
      dispatch(storeCommentsScreenInfo(response.data, postID, screenID, false));
    })
    .catch(error => {
      if (paging) {
        dispatch(stopCommentsPageLoading(postID, screenID));
      } else {
        dispatch(stopInitialCommentsLoading(postID, screenID));
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const deleteComment = (postID, commentID) => dispatch => {
  dispatch(startLoading());
  axios.delete(`${ROOT_URL}/api/comments/${commentID}`)
    .then(() => {
      dispatch(stopLoading());
      dispatch({
        type: DELETE_COMMENT,
        payload: { postID, commentID }
      });
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
