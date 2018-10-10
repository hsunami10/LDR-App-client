import axios from 'axios';
import uuidv4 from 'uuid/v4';
import {
  CREATE_TOPIC
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { pushRoute } from './NavigationActions';
import { handleError, waitUntilMinTime } from '../assets/helpers';

// ========================================= Create Topic =========================================
const createTopicResponse = ({ dispatch, response, navigation, createTopicErrCb }) => {
  dispatch(stopLoading());
  if (response.data.success) {
    dispatch({
      type: CREATE_TOPIC,
      payload: response.data
    });
    navigation.goBack();
  } else {
    createTopicErrCb(response.data.msg);
  }
};

export const createTopic = (dataObj, navigation, createTopicErrCb) => dispatch => {
  const beforeReq = Date.now();
  dispatch(startLoading());

  const data = new FormData();
  data.append('name', dataObj.name);
  data.append('description', dataObj.description);
  data.append('type', 'topic');
  data.append('topic_id', uuidv4());
  data.append('clientImage', dataObj.clientImage);

  axios.post(`${ROOT_URL}/api/topics/create/${dataObj.user_id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(response => {
      waitUntilMinTime(
        beforeReq,
        createTopicResponse,
        { dispatch, response, navigation, createTopicErrCb }
      );
    })
    .catch(error => {
      handleError(error);
    });
};
