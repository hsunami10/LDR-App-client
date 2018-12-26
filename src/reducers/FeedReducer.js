import {
  START_FEED_LOADING,
  STOP_FEED_LOADING,
  LOG_OUT_USER,
  GET_USER_FEED,
  START_INITIAL_FEED_LOADING,
  STOP_INITIAL_FEED_LOADING,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  initial_loading: false,
  keepPaging: false, // Stop continuous calls in onEndReached when there's no more data to retrieve / page
  posts_order: [] // Stores order of posts
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
      return {
        ...state,
        posts_order: action.payload.replace ? action.payload.order : [...state.posts_order, ...action.payload.order],
        keepPaging: action.payload.order.length !== 0 // Continue paging only when there is data retrieved
      };
    default:
      return state;
  }
};
