import {
  START_FEED_LOADING,
  STOP_FEED_LOADING,
  LOG_OUT_USER,
  GET_USER_FEED,
  SORT_FEED,
  START_INITIAL_FEED_LOADING,
  STOP_INITIAL_FEED_LOADING,
  EDIT_POST_FEED
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  initial_loading: false,
  message: '',
  offset: 0,
  keepPaging: false, // Stop continuous calls in onEndReached when there's no more data to retrieve / page
  posts: [],
  post_likes: {}
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
      // Only show message when there is absolutely nothing
      if (action.payload.posts.length === 0 && state.posts.length === 0) {
        message = 'Oh no, you have nothing! Create posts, add friends, or subscribe to topics to view posts on your feed.';
      }
      return {
        ...state,
        message,
        posts: action.payload.replace ? action.payload.posts : [...state.posts, ...action.payload.posts],
        post_likes: action.payload.replace ? action.payload.post_likes : { ...state.post_likes, ...action.payload.post_likes },
        offset: action.payload.offset,
        keepPaging: action.payload.posts.length !== 0 // Continue paging only when there is data retrieved
      };
    case SORT_FEED:
      // TODO: Sort feed action here later
      return state;

    case EDIT_POST_FEED:
      const copyPosts = [...state.posts];
      const copyPostLikes = { ...state.post_likes };

      if (copyPosts[action.payload.index] === undefined || copyPosts[action.payload.index].id !== action.payload.post.id) {
        for (let i = 0, len = copyPosts.length; i < len; i++) {
          if (copyPosts[i].id === action.payload.post.id) {
            copyPosts[i] = action.payload.post;
            break;
          }
        }
      } else {
        copyPosts[action.payload.index] = action.payload.post;
      }
      if (copyPostLikes[action.payload.post.id]) {
        delete copyPostLikes[action.payload.post.id];
      } else {
        copyPostLikes[action.payload.post.id] = { post_id: action.payload.post.id };
      }
      return {
        ...state,
        posts: copyPosts,
        post_likes: copyPostLikes
      };
    default:
      return state;
  }
};
