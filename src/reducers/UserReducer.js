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
  EDIT_POST
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
      const copyPosts = { ...state.posts.data };
      copyPosts[action.payload.id] = action.payload;
      return {
        ...state,
        posts: {
          ...state.posts,
          offset: state.posts.offset + 1,
          data: copyPosts,
          order: [action.payload.id, ...state.posts.order]
        }
      };
    case EDIT_POST:
      // TODO: Finish this later
      const editPosts = { ...state.posts.data };
      const copyPostLikes = { ...state.posts.post_likes };

      // Update posts object
      if (editPosts[action.payload.post.id]) {
        editPosts[action.payload.post.id] = action.payload.post;
      }

      // Update post_likes object if necessary
      if (action.payload.type === 'num_likes') {
        if (copyPostLikes[action.payload.post.id]) {
          delete copyPostLikes[action.payload.post.id];
        } else {
          copyPostLikes[action.payload.post.id] = { post_id: action.payload.post.id };
        }
      }

      return {
        ...state,
        posts: {
          ...state.posts,
          data: editPosts,
          post_likes: copyPostLikes
        }
      };
      // return state;

    case SET_SELECTED_USER:
      return { ...state, selected_user: action.payload };
    case FETCH_ALIASES:
      return { ...state, aliases: action.payload, alias_fetched: true };

    default:
      return state;
  }
};
