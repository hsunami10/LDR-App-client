import {
  START_FEED_LOADING,
  STOP_FEED_LOADING,
  LOG_OUT_USER,
  GET_USER_FEED,
  SORT_FEED,
  START_INITIAL_FEED_LOADING,
  STOP_INITIAL_FEED_LOADING,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  initial_loading: false,
  message: '',
  offset: 0,
  posts: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case START_FEED_LOADING:
      return { ...state, loading: true };
    case STOP_FEED_LOADING:
      return { ...state, loading: false };
    case START_INITIAL_FEED_LOADING:
      return { ...state, initial_loading: true };
    case STOP_INITIAL_FEED_LOADING:
      return { ...state, initial_loading: false };
    case GET_USER_FEED:
      let message = '';
      if (action.payload.length === 0) {
        message = 'Oh no, you have nothing! Create posts, add friends, or subscribe to topics to view posts on your feed.';
      }
      return {
        ...state,
        message,
        posts: action.payload.replace ? action.payload.posts : [...state.posts, ...action.payload.posts],
        offset: action.payload.offset
      };
    case SORT_FEED:
      // TODO: Sort feed action here later
      return state;
    default:
      return state;
  }
};
