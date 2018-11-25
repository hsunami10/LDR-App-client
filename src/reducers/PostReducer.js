import {
  LOG_OUT_USER,
  STORE_USER_SCREEN_INFO,
  GET_USER_FEED,
  CREATE_POST,
  EDIT_POST,
  DELETE_POST,
  DELETE_COMMENT
} from '../actions/types';

// Holds all posts data - want all posts to be the same across screens
const INITIAL_STATE = {
  none_msg: 'This post does not exist or has been deleted.',
  post_likes: {},
  all_posts: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case STORE_USER_SCREEN_INFO: // Called on every fetch user profile
      return {
        ...state,
        post_likes: { ...state.post_likes, ...action.payload.user.posts.post_likes },
        all_posts: { ...state.all_posts, ...action.payload.user.posts.data }
      };
    case GET_USER_FEED:
      return {
        ...state,
        post_likes: { ...state.post_likes, ...action.payload.post_likes },
        all_posts: { ...state.all_posts, ...action.payload.posts }
      };

    case CREATE_POST:
      return {
        ...state,
        all_posts: {
          ...state.all_posts,
          [action.payload.id]: action.payload
        }
      };
    case EDIT_POST:
      const copyPosts = { ...state.all_posts };
      const copyPostLikes = { ...state.post_likes };
      copyPosts[action.payload.post.id] = action.payload.post;
      if (action.payload.type === 'num_likes') {
        if (copyPostLikes[action.payload.post.id]) {
          delete copyPostLikes[action.payload.post.id];
        } else {
          copyPostLikes[action.payload.post.id] = true;
        }
      }
      return {
        ...state,
        post_likes: copyPostLikes,
        all_posts: copyPosts
      };
    case DELETE_POST:
      const copyPosts2 = { ...state.all_posts };
      const copyPostLikes2 = { ...state.post_likes };
      delete copyPosts2[action.payload.postID];
      delete copyPostLikes2[action.payload.postID];
      return {
        ...state,
        post_likes: copyPostLikes2,
        all_posts: copyPosts2
      };

    case DELETE_COMMENT:
      const copyPosts3 = { ...state.all_posts };
      copyPosts3[action.payload.postID] = {
        ...copyPosts3[action.payload.postID],
        num_comments: parseInt(copyPosts3[action.payload.postID].num_comments, 10) - 1
      };
      return { ...state, all_posts: copyPosts3 };
    default:
      return state;
  }
};
