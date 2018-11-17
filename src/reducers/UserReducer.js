import {
  LOG_OUT_USER,
  STORE_USER_INFO,
  START_USER_LOADING,
  STOP_USER_LOADING,
  START_INITIAL_USER_LOADING,
  STOP_INITIAL_USER_LOADING,
  FETCH_ALIASES
} from '../actions/types';

// TODO: Add default values for subscribers && friends later
const INITIAL_STATE = {
  aliases: [],
  alias_fetched: false, // Keeps track of whether or not aliases have already been fetched from database - stops unnecessary repeated fetches
  posts: {
    offset: 0,
    data: {},
    order: [],
    post_likes: {}
  },
  coordinates: null,
  partner: null,
  initial_loading: false,
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    // Loading action types for refreshing your own profile page
    case START_USER_LOADING:
      return { ...state, loading: true };
    case STOP_USER_LOADING:
      return { ...state, loading: false };
    case START_INITIAL_USER_LOADING:
      return { ...state, initial_loading: true };
    case STOP_INITIAL_USER_LOADING:
      return { ...state, initial_loading: false };

    case STORE_USER_INFO:
      return { ...state, ...action.payload, alias_fetched: true };

    case FETCH_ALIASES:
      return { ...state, aliases: action.payload, alias_fetched: true };

    default:
      return state;
  }
};
