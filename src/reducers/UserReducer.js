import {
  CREATE_POST,
  SET_SELECTED_USER,
  LOG_OUT_USER,
  STORE_USER_INFO,
  START_USER_LOADING,
  STOP_USER_LOADING,
  START_INITIAL_USER_LOADING,
  STOP_INITIAL_USER_LOADING,
  FETCH_ALIASES,
  EDIT_POST_FEED
} from '../actions/types';

// TODO: Add default values for subscribers && friends later
const INITIAL_STATE = {
  aliases: [],
  alias_fetched: false, // Keeps track of whether or not aliases have already been fetched from database - stops unnecessary repeated fetches
  posts: {
    offset: 0,
    data: [],
    post_likes: {}
  },
  coordinates: null,
  partner: null,
  selected_user: null,
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
    case CREATE_POST:
      return {
        ...state,
        posts: {
          offset: state.posts.offset + 1,
          data: [action.payload, ...state.posts.data]
        }
      };
    /*
    BUG: Will break if you visit a user in one tab, then visit a user in another tab

    Maybe for each tab, have an array of objects of selected users
    So every time you view a profile, it adds the user object to the array, which keeps track of it

    OR NOTE: DO THIS - change "selected user" to local state instead - use screenProps to pass down the selected user id
    Remove all selected user actions, action types, and redux state
     */
    case SET_SELECTED_USER:
      return { ...state, selected_user: action.payload };
    case FETCH_ALIASES:
      return { ...state, aliases: action.payload, alias_fetched: true };

    default:
      return state;
  }
};
