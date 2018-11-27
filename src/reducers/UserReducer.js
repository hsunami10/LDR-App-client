import {
  LOG_OUT_USER,
  STORE_USER_INFO,
  START_USER_SCREEN_REFRESHING, // TODO: Remove all of these later
  STOP_USER_SCREEN_REFRESHING,
  START_INITIAL_USER_SCREEN_LOADING,
  STOP_INITIAL_USER_SCREEN_LOADING
} from '../actions/types';

// TODO: Add default values for subscribers && friends later
const INITIAL_STATE = {
  id: '',
  coordinates: null,
  initial_loading: false,
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    // Loading action types for refreshing your own profile page
    case START_USER_SCREEN_REFRESHING:
      return { ...state, loading: true };
    case STOP_USER_SCREEN_REFRESHING:
      return { ...state, loading: false };
    case START_INITIAL_USER_SCREEN_LOADING:
      return { ...state, initial_loading: true };
    case STOP_INITIAL_USER_SCREEN_LOADING:
      return { ...state, initial_loading: false };

    case STORE_USER_INFO:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
