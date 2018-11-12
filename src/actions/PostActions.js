import axios from 'axios';
import {
  CREATE_POST,
  EDIT_POST_FEED,
  DELETE_POST
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { goBackwardRoute } from './NavigationActions';
import { handleError } from '../assets/helpers';

export const createPost = (postObj, navigation) => dispatch => {
  // postObj - { user_id, topic_id, alias_id, body, coordinates }
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/posts/${postObj.user_id}`, postObj)
    .then(response => {
      dispatch(stopLoading());
      dispatch({
        type: CREATE_POST,
        payload: response.data
      });
      dispatch(goBackwardRoute());
      navigation.pop();
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

// obj - { index, post, type, data, userID }
// type: 'num_likes', 'body' - only 2 ways to edit post
export const editPost = obj => dispatch => {
  const { post, type, data, userID } = obj;
  post[type] = data;
  dispatch({
    type: EDIT_POST_FEED,
    payload: {
      ...obj,
      post
    }
  });
  axios.put(`${ROOT_URL}/api/posts/${userID}`, { type, data, post_id: post.id })
    .then(() => null)
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
// TODO: Delete post, update / edit post, get post (+ post comments and everything) - for view post screen
