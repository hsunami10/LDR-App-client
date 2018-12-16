import {
  LOG_OUT_USER,
  DELETE_POST,
  START_INITIAL_DISCOVER_POSTS_LOADING,
  STOP_INITIAL_DISCOVER_POSTS_LOADING,
  START_DISCOVER_POSTS_REFRESHING,
  STOP_DISCOVER_POSTS_REFRESHING,
  START_INITIAL_DISCOVER_USERS_LOADING,
  STOP_INITIAL_DISCOVER_USERS_LOADING,
  START_DISCOVER_USERS_REFRESHING,
  STOP_DISCOVER_USERS_REFRESHING,
  START_INITIAL_DISCOVER_TOPICS_LOADING,
  STOP_INITIAL_DISCOVER_TOPICS_LOADING,
  START_DISCOVER_TOPICS_REFRESHING,
  STOP_DISCOVER_TOPICS_REFRESHING,
  GET_DISCOVER_POSTS,
  GET_DISCOVER_USERS,
  GET_DISCOVER_TOPICS,
} from '../actions/types';

const INITIAL_STATE = {
  posts: {
    initial_loading: false,
    refreshing: false,
    order: [],
    offset: 0,
    keepPaging: false,
  },
  users: {
    initial_loading: false,
    refreshing: false,
    order: [],
    offset: 0,
    keepPaging: false,
  },
  topics: {
    initial_loading: false,
    refreshing: false,
    order: [],
    offset: 0,
    keepPaging: false,
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case DELETE_POST:
      // TODO: Finish delete post later
      return state;
    case START_INITIAL_DISCOVER_POSTS_LOADING:
      return {
        ...state,
        posts: {
          ...state.posts,
          initial_loading: true
        }
      };
    case STOP_INITIAL_DISCOVER_POSTS_LOADING:
      return {
        ...state,
        posts: {
          ...state.posts,
          initial_loading: false
        }
      };
    case START_DISCOVER_POSTS_REFRESHING:
      return { ...state, refreshing: true };
    case STOP_DISCOVER_POSTS_REFRESHING:
      return { ...state, refreshing: false };
    case GET_DISCOVER_POSTS:
      return {
        ...state,
        posts: {
          ...state.posts,
          order: action.payload.replace ? action.payload.order : [...state.posts.order, ...action.payload.order],
          offset: action.payload.offset,
          keepPaging: action.payload.order.length !== 0
        }
      };

    default:
      return state;
  }
};
