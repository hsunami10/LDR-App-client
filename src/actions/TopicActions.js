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
  SUBSCRIBE_TOPIC,
  UNSUBSCRIBE_TOPIC,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { stopLoading, startLoading } from './LoadingActions';
import { goBackwardRoute } from './NavigationActions';
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { logOut, getCookie } from '../assets/helpers/authentication';

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

  getCookie()
    .then(cookie => {
      axios.post(`${ROOT_URL}/api/topics/create/${dataObj.user_id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Cookie: cookie
        },
        withCredentials: true
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
            createTopicErrorCB(response.data.message);
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

export const getSubscribedTopics = (id, refresh, order, direction, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startTopicRefreshing());
  } else if (refresh === false) {
    dispatch(startTopicLoading());
  }
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/topics/subscribed/${id}?order=${order}&direction=${direction}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (refresh === true) {
            dispatch(stopTopicRefreshing());
          } else if (refresh === false) {
            dispatch(stopTopicLoading());
          }
          if (response.data.success) {
            dispatch({
              type: GET_SUBSCRIBED_TOPICS,
              payload: response.data.result
            });
          } else {
            alertWithSingleAction(
              'Oh no!',
              response.data.message,
              () => dispatch(logOut(navigation)),
              'Log Out'
            );
          }
        })
        .catch(error => {
          if (refresh === true) {
            dispatch(stopTopicRefreshing());
          } else if (refresh === false) {
            dispatch(stopTopicLoading());
          }
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopTopicRefreshing());
      } else if (refresh === false) {
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

export const subscribeTopic = (userID, topicID) => dispatch => {
  dispatch({
    type: SUBSCRIBE_TOPIC,
    payload: topicID
  });
  getCookie()
    .then(cookie => {
      axios.post(`${ROOT_URL}/api/topics/subscribe/${userID}`, { topic_id: topicID }, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .catch(error => {
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const unsubscribeTopic = (userID, topicID) => dispatch => {
  dispatch({
    type: UNSUBSCRIBE_TOPIC,
    payload: topicID
  });
  getCookie()
    .then(cookie => {
      axios.delete(`${ROOT_URL}/api/topics/unsubscribe/${userID}?topic_id=${topicID}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .catch(error => {
          if (error.response) {
            handleError(error.response.data, false);
          } else {
            handleError(error, false);
          }
        });
    })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
