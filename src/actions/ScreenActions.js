import {
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO,
  STORE_POST_SCREEN_INFO,
  REMOVE_POST_SCREEN_INFO,
  START_USER_SCREEN_REFRESHING,
  STOP_USER_SCREEN_REFRESHING,
  START_INITIAL_USER_SCREEN_LOADING,
  STOP_INITIAL_USER_SCREEN_LOADING,
} from './types';

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

export const storeUserScreenInfo = (user, screenID) => ({
  type: STORE_USER_SCREEN_INFO,
  payload: { user, screenID }
});
export const removeUserScreenInfo = (userID, screenID) => ({
  type: REMOVE_USER_SCREEN_INFO,
  payload: { userID, screenID }
});

// ============================================ Posts ============================================
export const storePostScreenInfo = (post, comments, screenID) => ({
  type: STORE_POST_SCREEN_INFO,
  payload: { post, comments, screenID }
});
export const removePostScreenInfo = (postID, screenID) => ({
  type: REMOVE_POST_SCREEN_INFO,
  payload: { postID, screenID }
});
