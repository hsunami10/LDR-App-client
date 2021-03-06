import axios from 'axios';
import {
  START_INITIAL_SOCIAL_LOADING,
  STOP_INITIAL_SOCIAL_LOADING,
  START_SOCIAL_REFRESHING,
  STOP_SOCIAL_REFRESHING,
  GET_SOCIAL_INFO,
  REMOVE_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  REMOVE_PENDING_REQUEST,
  CANCEL_PENDING_REQUEST,
  REMOVE_FRIEND,
  UNFRIEND_USER,
  DELETE_USER,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { logOut, getCookie } from '../assets/helpers/authentication';

export const deleteUser = id => ({ type: DELETE_USER, payload: id });

export const startInitialSocialLoading = () => ({ type: START_INITIAL_SOCIAL_LOADING });
export const stopInitialSocialLoading = () => ({ type: STOP_INITIAL_SOCIAL_LOADING });

export const startSocialRefreshing = () => ({ type: START_SOCIAL_REFRESHING });
export const stopSocialRefreshing = () => ({ type: STOP_SOCIAL_REFRESHING });

export const getSocialInfo = (userID, refresh, lastID, lastData, navigation) => dispatch => {
  if (refresh) {
    dispatch(startSocialRefreshing());
  } else {
    dispatch(startInitialSocialLoading());
  }
  getCookie()
    .then(cookie => {
      axios.get(`${ROOT_URL}/api/social/${userID}?last_id=${lastID}&last_data=${lastData}`, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
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
              response.data.message,
              () => dispatch(logOut(navigation)),
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
  getCookie()
    .then(cookie => {
      axios.post(`${ROOT_URL}/api/social/send-friend-request/${userID}`, { targetID }, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (!response.data.success) {
            alertWithSingleAction(
              'Oh no!',
              response.data.message,
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
  getCookie()
    .then(cookie => {
      axios.post(`${ROOT_URL}/api/social/accept-friend-request/${userID}`, { targetID }, {
        headers: {
          Cookie: cookie
        },
        withCredentials: true
      })
        .then(response => {
          if (!response.data.success) {
            alertWithSingleAction(
              'Oh no!',
              response.data.message,
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
  getCookie()
    .then(cookie => {
      axios.delete(`${ROOT_URL}/api/social/reject-friend-request/${userID}?target_id=${targetID}`, {
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
  getCookie()
    .then(cookie => {
      axios.delete(`${ROOT_URL}/api/social/cancel-pending/${userID}?target_id=${targetID}`, {
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
  getCookie()
    .then(cookie => {
      axios.delete(`${ROOT_URL}/api/social/unfriend/${userID}?target_id=${targetID}`, {
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
