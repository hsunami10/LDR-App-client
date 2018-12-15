import axios from 'axios';
import moment from 'moment';
import {
  START_INITIAL_SOCIAL_LOADING,
  STOP_INITIAL_SOCIAL_LOADING,
  START_SOCIAL_REFRESHING,
  STOP_SOCIAL_REFRESHING,
  GET_SOCIAL_INFO,
  GET_USER_FRIENDS,
  REMOVE_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  REMOVE_PENDING_REQUEST,
  CANCEL_PENDING_REQUEST,
  REMOVE_FRIEND,
  UNFRIEND_USER
} from './types';
import { ROOT_URL } from '../constants/variables';
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { logOut } from '../assets/helpers/authentication';

export const startInitialSocialLoading = () => ({ type: START_INITIAL_SOCIAL_LOADING });
export const stopInitialSocialLoading = () => ({ type: STOP_INITIAL_SOCIAL_LOADING });

export const startSocialRefreshing = () => ({ type: START_SOCIAL_REFRESHING });
export const stopSocialRefreshing = () => ({ type: STOP_SOCIAL_REFRESHING });

export const getSocialInfo = (userID, refresh, offset, navigation) => dispatch => {
  if (refresh) {
    dispatch(startSocialRefreshing());
  } else {
    dispatch(startInitialSocialLoading());
  }
  axios.get(`${ROOT_URL}/api/social/${userID}?offset=${offset}`)
    .then(response => {
      if (refresh) {
        dispatch(stopSocialRefreshing());
      } else {
        dispatch(stopInitialSocialLoading());
      }
      if (response.data.success) {
        dispatch({
          type: GET_SOCIAL_INFO,
          payload: response.data.social
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => logOut(navigation),
          'Log Out'
        );
      }
    })
    .catch(error => {
      if (refresh) {
        dispatch(stopSocialRefreshing());
      } else {
        dispatch(stopInitialSocialLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const getFriends = (userID, offset) => dispatch => {
  axios.get(`${ROOT_URL}/api/social/get-friends/${userID}?offset=${offset}`)
    .then(response => {
      dispatch({
        type: GET_USER_FRIENDS,
        payload: {
          ...response.data,
          replace: offset === 0
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

// ======================================= Friend Requests =======================================
export const removeFriendRequest = targetID => ({
  type: REMOVE_FRIEND_REQUEST,
  payload: targetID
});

export const sendFriendRequest = (userID, targetID) => dispatch => {
  dispatch({
    type: SEND_FRIEND_REQUEST,
    payload: targetID
  });
  axios.post(`${ROOT_URL}/api/social/send-friend-request/${userID}`, { targetID })
    .then(response => {
      if (!response.data.success) {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => dispatch(removeFriendRequest(targetID))
        );
      }
    })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const acceptFriendRequest = (userID, targetID) => dispatch => {
  dispatch({
    type: ACCEPT_FRIEND_REQUEST,
    payload: targetID
  });
  axios.post(`${ROOT_URL}/api/social/accept-friend-request/${userID}`, { targetID })
    .then(response => {
      if (!response.data.success) {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => dispatch(removeFriendRequest(targetID))
        );
      }
    })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const rejectFriendRequest = (userID, targetID) => dispatch => {
  dispatch({
    type: REJECT_FRIEND_REQUEST,
    payload: targetID
  });
  axios.delete(`${ROOT_URL}/api/social/reject-friend-request/${userID}?target_id=${targetID}`)
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ======================================= Pending Requests =======================================
export const removePendingRequest = targetID => ({
  type: REMOVE_PENDING_REQUEST,
  payload: targetID
});

export const cancelPendingRequest = (userID, targetID) => dispatch => {
  dispatch({
    type: CANCEL_PENDING_REQUEST,
    payload: targetID
  });
  axios.delete(`${ROOT_URL}/api/social/cancel-pending/${userID}?target_id=${targetID}`)
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// =========================================== Friends ===========================================
export const removeFriend = targetID => ({
  type: REMOVE_FRIEND,
  payload: targetID
});

export const unfriendUser = (userID, targetID) => dispatch => {
  dispatch({
    type: UNFRIEND_USER,
    payload: targetID
  });
  axios.delete(`${ROOT_URL}/api/social/unfriend/${userID}?target_id=${targetID}`)
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
