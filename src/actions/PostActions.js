import axios from 'axios';
import { Alert } from 'react-native';
import {
  CREATE_POST
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { goBackwardRoute } from './NavigationActions';
import { handleError } from '../assets/helpers';

export const createPost = (postObj, navigation) => dispatch => {
  // postObj - { user_id, topic_id, alias_id, body, coordinates }
  dispatch(startLoading());
  axios.post(`${ROOT_URL}/api/posts/${postObj.user_id}`)
    .then(response => {
      dispatch(stopLoading());
      dispatch({
        type: CREATE_POST,
        payload: response.data
      });
      dispatch(goBackwardRoute());
      navigation.goBack();
    })
    .catch(error => {
      handleError(error, false);
    });
};

// TODO: Delete post, update / edit post, get post (+ post comments and everything) - for view post screen
