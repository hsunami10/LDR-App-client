import {
  CREATE_POST,
  SET_SELECTED_USER,
  LOG_OUT_USER,
  STORE_USER_INFO,
  START_USER_LOADING,
  STOP_USER_LOADING
} from '../actions/types';

const INITIAL_STATE = {
  aliases: [],
  posts: {
    offset: 0,
    data: []
  },
  partner: null,
  selected_user: null,
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
      return { ...state, ...action.payload };
    case CREATE_POST:
      return {
        ...state,
        posts: {
          offset: state.user.posts.offset + 1,
          data: [action.payload, ...state.posts.data]
        }
      };
    case SET_SELECTED_USER:
      return { ...state, selected_user: action.payload };
    default:
      return state;
  }
};
