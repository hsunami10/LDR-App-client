import {
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO,
  STORE_POST_SCREEN_INFO,
  REMOVE_POST_SCREEN_INFO
} from './types';

// Profile / user
export const storeUserScreenInfo = (user, screenID) => ({
  type: STORE_USER_SCREEN_INFO,
  payload: { user, screenID }
});
export const removeUserScreenInfo = (userID, screenID) => ({
  type: REMOVE_USER_SCREEN_INFO,
  payload: { userID, screenID }
});

// Posts
export const storePostScreenInfo = (post, comments, screenID) => ({
  type: STORE_POST_SCREEN_INFO,
  payload: { post, comments, screenID }
});
export const removePostScreenInfo = (postID, screenID) => ({
  type: REMOVE_POST_SCREEN_INFO,
  payload: { postID, screenID }
});
