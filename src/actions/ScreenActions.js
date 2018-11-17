import {
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO
} from './types';

export const storeUserScreenInfo = (user, screenID) => ({
  type: STORE_USER_SCREEN_INFO,
  payload: { user, screenID }
});

export const removeUserScreenInfo = (userID, screenID) => ({
  type: REMOVE_USER_SCREEN_INFO,
  payload: { userID, screenID }
});
