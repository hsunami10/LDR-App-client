import axios from 'axios';
import {
  DELETE_COMMENT,
  EDIT_COMMENT
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import {
  startCommentsPageLoading,
  stopCommentsPageLoading,
  storeCommentsScreenInfo
} from './ScreenActions';

export const getComments = (userID, postID, screenID, lastID, lastDate, noPostCB) => dispatch => {
  dispatch(startCommentsPageLoading(postID, screenID));
  axios.get(`${ROOT_URL}/api/comments/${userID}?last_id=${lastID}&last_date=${lastDate}&post_id=${postID}`)
    .then(response => {
      dispatch(stopCommentsPageLoading(postID, screenID));
      if (response.data.success) {
        dispatch(storeCommentsScreenInfo(response.data.comments, postID, screenID, false));
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          noPostCB
        );
      }
    })
    .catch(error => {
      dispatch(stopCommentsPageLoading(postID, screenID));
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

const deleteCommentAction = (postID, commentID) => ({
  type: DELETE_COMMENT,
  payload: { postID, commentID }
});
export const deleteComment = (userID, postID, commentID) => dispatch => {
  dispatch(startLoading());
  axios.delete(`${ROOT_URL}/api/comments/${commentID}?user_id=${userID}&post_id=${postID}`)
    .then(() => {
      dispatch(stopLoading());
      dispatch(deleteCommentAction(postID, commentID));
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

// obj - { comment, type: 'num_likes' / 'body', data, userID }
export const editComment = obj => dispatch => {
  const { type, comment, data, userID } = obj;
  comment[type] = data;
  dispatch({
    type: EDIT_COMMENT,
    payload: {
      ...obj,
      comment
    }
  });
  axios.put(`${ROOT_URL}/api/comments/${userID}`, { type, comment })
    .then(response => {
      console.log(response.status);
      console.log('TODO: do something here after editing comment');
    })
    .catch(error => {
      // 1 possible error: foreign key violation comments
      if (error.response) {
        handleError(error.response.data, false, () => dispatch(deleteCommentAction(comment.post_id, comment.id)));
      } else {
        handleError(error, false, () => dispatch(deleteCommentAction(comment.post_id, comment.id)));
      }
    });
};
