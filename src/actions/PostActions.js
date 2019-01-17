import axios from 'axios';
import {
  CREATE_POST,
  EDIT_POST,
  DELETE_POST
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { goBackwardRoute } from './NavigationActions';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { handleError } from '../assets/helpers/errors';
import { NO_POST_MSG } from '../constants/noneMessages';
import { getCookie } from '../assets/helpers/authentication';
import {
  storeCommentsScreenInfo,
  startPostScreenRefreshing,
  stopPostScreenRefreshing,
  initializePostScreenInfo
} from './ScreenActions';

export const noPostError = (dispatch, userID, postID, navigation, message = NO_POST_MSG) => {
  alertWithSingleAction(
    'Oh no!',
    message,
    () => {
      dispatch(deletePostAction(userID, postID));
      if (navigation) {
        navigation.pop();
      }
    }
  );
};

export const getPostAndComments = (userID, refresh, postID, screenID, length, navigation) => dispatch => {
  if (refresh) {
    dispatch(startPostScreenRefreshing(postID, screenID));
  } else {
    dispatch(initializePostScreenInfo(postID, screenID));
  }
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/posts/${userID}?length=${length}&post_id=${postID}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (refresh) {
            dispatch(stopPostScreenRefreshing(postID, screenID));
          }
          if (response.data.success) {
            const { result } = response.data;
            dispatch({
              type: EDIT_POST,
              payload: {
                post: result.post,
                type: null
              }
            });
            dispatch(storeCommentsScreenInfo(result.comments, postID, screenID, true));
          } else if (refresh) {
            noPostError(dispatch, userID, postID, navigation, response.data.message);
          } else {
            dispatch(deletePostAction(userID, postID));
          }
        })
        .catch(error => {
          if (refresh) {
            dispatch(stopPostScreenRefreshing(postID, screenID));
          }
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
    .catch(error => {
      if (refresh) {
        dispatch(stopPostScreenRefreshing(postID, screenID));
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const createPost = (postObj, navigation) => dispatch => {
  // postObj - { user_id, topic_id, body, coordinates }
  dispatch(startLoading());
  getCookie()
    .then(cookie => {
      axios.post(`${ROOT_URL}/api/posts/${postObj.user_id}`, postObj, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
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
          // 2 possible errors: foreign key violation users or topics
          // callback only gets invoked when topics
          dispatch(stopLoading());
          if (error.response) {
            handleError(error.response.data, false, () => console.log('TODO: delete topic here'));
          } else {
            handleError(error, false, () => console.log('TODO: delete topic here'));
          }
        });
    })
    .catch(error => {
      dispatch(stopLoading());
      if (error.response) {
        handleError(error.response.data, false, () => console.log('TODO: delete topic here'));
      } else {
        handleError(error, false, () => console.log('TODO: delete topic here'));
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
userID - needed for num_likes only, for looking up post_likes in table
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
  getCookie()
    .then(cookie => {
      axios.put(`${ROOT_URL}/api/posts/${userID}`, { post, type }, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(() => {
          if (type === 'body') {
            dispatch(stopLoading());
            navigation.pop();
          }
        })
        .catch(error => {
          // 1 possible error: foreign key violation posts
          if (type === 'body') {
            dispatch(stopLoading());
          }
          if (error.response) {
            handleError(error.response.data, false, () => noPostError(dispatch, userID, post.id, navigation));
          } else {
            handleError(error, false, () => noPostError(dispatch, userID, post.id, navigation));
          }
        });
    })
    .catch(error => {
      if (type === 'body') {
        dispatch(stopLoading());
      }
      if (error.response) {
        handleError(error.response.data, false, () => noPostError(dispatch, userID, post.id, navigation));
      } else {
        handleError(error, false, () => noPostError(dispatch, userID, post.id, navigation));
      }
    });
};

export const deletePostAction = (userID, postID) => ({
  type: DELETE_POST,
  payload: { userID, postID }
});
export const deletePost = (userID, postID, navigation = null) => dispatch => {
  dispatch(startLoading());
  getCookie()
    .then(cookie => {
      axios.delete(`${ROOT_URL}/api/posts/${postID}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(() => {
          dispatch(stopLoading());
          dispatch(deletePostAction(userID, postID));
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
