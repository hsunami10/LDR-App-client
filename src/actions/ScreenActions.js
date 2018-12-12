import {
  STORE_USER_SCREEN_INFO_SUCCESS,
  STORE_USER_SCREEN_INFO_FAILURE,
  REMOVE_USER_SCREEN_INFO,
  REMOVE_POST_SCREEN_INFO,
  START_USER_SCREEN_REFRESHING,
  STOP_USER_SCREEN_REFRESHING,
  START_INITIAL_USER_SCREEN_LOADING,
  STOP_INITIAL_USER_SCREEN_LOADING,
  START_POST_SCREEN_REFRESHING,
  STOP_POST_SCREEN_REFRESHING,
  START_COMMENTS_PAGE_LOADING,
  STOP_COMMENTS_PAGE_LOADING,
  STORE_COMMENTS_SCREEN_INFO,
  INIT_POST_SCREEN_INFO
} from './types';
import { COMMENTS_PAGINATE_LIMIT } from '../constants/variables';

// ======================================= Profile / User =======================================
// Loading only for profile screens and anything user-related - refreshing
export const startUserScreenRefreshing = (userID, screenID) => ({
  type: START_USER_SCREEN_REFRESHING,
  payload: { userID, screenID }
});
export const stopUserScreenRefreshing = (userID, screenID) => ({
  type: STOP_USER_SCREEN_REFRESHING,
  payload: { userID, screenID }
});

// Dispatched only on first user load
export const startInitialUserLoading = (userID, screenID) => ({
  type: START_INITIAL_USER_SCREEN_LOADING,
  payload: { userID, screenID }
});
export const stopInitialUserLoading = (userID, screenID) => ({
  type: STOP_INITIAL_USER_SCREEN_LOADING,
  payload: { userID, screenID }
});

export const storeUserScreenInfoSuccess = (user, screenID) => ({
  type: STORE_USER_SCREEN_INFO_SUCCESS,
  payload: { user, screenID }
});
export const storeUserScreenInfoFailure = (userID, screenID) => ({
  type: STORE_USER_SCREEN_INFO_FAILURE,
  payload: { userID, screenID }
});
export const removeUserScreenInfo = (userID, screenID) => ({
  type: REMOVE_USER_SCREEN_INFO,
  payload: { userID, screenID }
});

// ============================================ Posts ============================================
export const initializePostScreenInfo = (postID, screenID) => ({
  type: INIT_POST_SCREEN_INFO,
  payload: { postID, screenID }
});
export const removePostScreenInfo = (postID, screenID) => ({
  type: REMOVE_POST_SCREEN_INFO,
  payload: { postID, screenID }
});

export const startPostScreenRefreshing = (postID, screenID) => ({
  type: START_POST_SCREEN_REFRESHING,
  payload: { postID, screenID }
});
export const stopPostScreenRefreshing = (postID, screenID) => ({
  type: STOP_POST_SCREEN_REFRESHING,
  payload: { postID, screenID }
});

// =========================================== Comments ===========================================
export const storeCommentsScreenInfo = (data, postID, screenID, replace) => ({
  type: STORE_COMMENTS_SCREEN_INFO,
  payload: {
    data,
    postID,
    screenID,
    replace,
    keepPaging: data.order.length >= COMMENTS_PAGINATE_LIMIT
  }
});

export const startCommentsPageLoading = (postID, screenID) => ({
  type: START_COMMENTS_PAGE_LOADING,
  payload: { postID, screenID }
});
export const stopCommentsPageLoading = (postID, screenID) => ({
  type: STOP_COMMENTS_PAGE_LOADING,
  payload: { postID, screenID }
});
