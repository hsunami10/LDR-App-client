import axios from 'axios';
import {
  CREATE_POST,
  EDIT_POST,
  DELETE_POST
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { goBackwardRoute } from './NavigationActions';
import { handleError } from '../assets/helpers';
import {
  storeCommentsScreenInfo,
  startPostScreenRefreshing,
  stopPostScreenRefreshing
} from './ScreenActions';

export const getPostAndComments = (userID, postID, screenID, earliestDate) => dispatch => {
  dispatch(startPostScreenRefreshing(postID, screenID));
  axios.get(`${ROOT_URL}/api/posts/${userID}?earliest_date=${earliestDate}&post_id=${postID}`)
    .then(response => {
      dispatch(stopPostScreenRefreshing(postID, screenID));
      dispatch({
        type: EDIT_POST,
        payload: {
          post: response.data.post,
          type: null
        }
      });
      dispatch(storeCommentsScreenInfo(response.data.comments, postID, screenID, true));
    })
    .catch(error => {
      dispatch(stopPostScreenRefreshing(postID, screenID));
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

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

/*
obj - { post, type, data, userID }
type: 'num_likes', 'body' - only 2 ways to edit post
navigation = not null ONLY if type is 'body'
data:
  - number if type = num_likes
  - object if type = body: { topic, body }
 */
export const editPost = (obj, navigation = null) => dispatch => {
  const { post, type, data, userID } = obj;
  if (type === 'body' && typeof data === 'object') {
    post[type] = data.body;
    post.topic_id = data.topic.id;
    post.name = data.topic.name;
    dispatch(startLoading());
  } else {
    post[type] = data;
  }

  dispatch({
    type: EDIT_POST,
    payload: {
      ...obj,
      post
    }
  });
  axios.put(`${ROOT_URL}/api/posts/${userID}`, { post, type })
    .then(() => {
      if (type === 'body') {
        dispatch(stopLoading());
        navigation.pop();
      }
    })
    .catch(error => {
      if (type === 'body') {
        dispatch(stopLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const deletePost = (userID, postID, navigation = null) => dispatch => {
  dispatch(startLoading());
  axios.delete(`${ROOT_URL}/api/posts/${postID}`)
    .then(() => {
      dispatch(stopLoading());
      dispatch({
        type: DELETE_POST,
        payload: { userID, postID }
      });
      if (navigation) {
        navigation.pop();
      }
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
