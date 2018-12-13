import axios from 'axios';
import uuidv4 from 'uuid/v4';
import {
  START_TOPIC_LOADING,
  STOP_TOPIC_LOADING,
  START_TOPIC_REFRESHING,
  STOP_TOPIC_REFRESHING,
  CREATE_TOPIC,
  CHOOSE_POST_TOPIC,
  GET_SUBSCRIBED_TOPICS,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { goBackwardRoute } from './NavigationActions';
import { handleError } from '../assets/helpers/errors';

export const startTopicLoading = () => ({ type: START_TOPIC_LOADING });
export const stopTopicLoading = () => ({ type: STOP_TOPIC_LOADING });

export const startTopicRefreshing = () => ({ type: START_TOPIC_REFRESHING });
export const stopTopicRefreshing = () => ({ type: STOP_TOPIC_REFRESHING });

// ========================================= Create Topic =========================================
export const createTopic = (dataObj, navigation, createTopicErrorCB) => dispatch => {
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
      dispatch(stopLoading());
      if (response.data.success) {
        dispatch({
          type: CREATE_TOPIC,
          payload: response.data.topic
        });
        // QUESTION: Navigate to topic screen?
        dispatch(goBackwardRoute());
        navigation.pop();
      } else {
        createTopicErrorCB(response.data.error);
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

export const getSubscribedTopics = (id, refresh, offset, order, direction, latest) => dispatch => {
  if (refresh === true) {
    dispatch(startTopicRefreshing());
  } else if (refresh === false) {
    dispatch(startTopicLoading());
  }
  axios.get(`${ROOT_URL}/api/subscribed-topics/${id}?offset=${offset}&order=${order}&direction=${direction}&latest=${latest}`)
    .then(response => {
      if (refresh) {
        dispatch(stopTopicRefreshing());
      } else {
        dispatch(stopTopicLoading());
      }
      dispatch({
        type: GET_SUBSCRIBED_TOPICS,
        payload: response.data
      });
    })
    .catch(error => {
      if (refresh) {
        dispatch(stopTopicRefreshing());
      } else {
        dispatch(stopTopicLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const choosePostTopic = topic => ({
  type: CHOOSE_POST_TOPIC,
  payload: topic
});
