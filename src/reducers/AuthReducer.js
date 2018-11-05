import {
  LOG_OUT_USER,
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_CREDENTIALS,
  SET_NOT_FIRST_LOG_IN,
  STORE_USER_INFO,
  START_USER_LOADING,
  STOP_USER_LOADING,
  SET_SELECTED_USER,
  CREATE_POST
} from '../actions/types';
import { handleError } from '../assets/helpers';

const INITIAL_STATE = {
  id: '',
  first_login: false,
  email: '',
  user: {
    aliases: [],
    posts: {
      offset: 0,
      data: []
    },
    partner: null
  },
  selected_user: null,
  error_field: '', // 'username', 'password', 'both'
  error_msg: ' ', // Text error message
  success: false, // Differentiate between red and green text
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // Loading action types for refreshing your own profile page
    case START_USER_LOADING:
      return { ...state, loading: true };
    case STOP_USER_LOADING:
      return { ...state, loading: false };
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case STORE_USER_INFO:
      return { ...state, user: action.payload };
    case SET_AUTH_ERRORS:
      const { errorField, errorMsg, success } = action.payload;
      if (errorField === 'username' || errorField === 'password' || errorField === '') {
        return {
          ...state,
          error_field: errorField,
          error_msg: errorMsg,
          success
        };
      }
      handleError(new Error('Invalid field type in SET_AUTH_ERRORS'), true);
      break;
    case RESET_AUTH_ERRORS:
      return { ...state, error_field: '', error_msg: ' ', success: false };
    case SET_USER_CREDENTIALS:
      return { ...state, id: action.payload.id, first_login: action.payload.firstLogin };
    case SET_NOT_FIRST_LOG_IN:
      return { ...state, first_login: false };

    // Selected user action types
    case SET_SELECTED_USER:
      return { ...state, selected_user: action.payload };

    // Post action types
    case CREATE_POST:
      const newPosts = {
        offset: state.user.posts.offset + 1,
        data: [action.payload, ...state.user.posts.data]
      };
      return { ...state, user: { ...state.user, posts: newPosts } };
    default:
      return state;
  }
};
