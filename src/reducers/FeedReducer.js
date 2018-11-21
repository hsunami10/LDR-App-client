import {
  START_FEED_LOADING,
  STOP_FEED_LOADING,
  LOG_OUT_USER,
  GET_USER_FEED,
  SORT_FEED,
  START_INITIAL_FEED_LOADING,
  STOP_INITIAL_FEED_LOADING,
  DELETE_POST
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  initial_loading: false,
  offset: 0,
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
        offset: action.payload.offset,
        keepPaging: action.payload.order.length !== 0 // Continue paging only when there is data retrieved
      };
    case SORT_FEED:
      // TODO: Sort feed action here later
      return state;

    case DELETE_POST:
      const copyOrder = [...state.posts_order];
      const index = copyOrder.indexOf(action.payload.postID);
      if (index >= 0) {
        copyOrder.splice(index, 1);
        return {
          ...state,
          offset: state.offset - 1,
          posts_order: copyOrder
        };
      }
      return state;
    default:
      return state;
  }
};
