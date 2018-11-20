import {
  LOG_OUT_USER,
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO,
  CREATE_POST,
  EDIT_POST,
  DELETE_POST,
  GET_USER_FEED
} from '../actions/types';

// NOTE: Only use this if there will be MULTIPLE screens with DIFFERENT data

// TODO: Handle some action types with search.feed and search.discover
const INITIAL_STATE = {
  profile: { // key: user_id, value: object of (key: screen_id (shortid, local state), value: screen user data - object)
    none_msg: 'This account does not exist or has been deleted.'
  },
  search: {
    feed: {},
    discover: {}
  },
  posts: { // key: post_id, value: object of (key: screen_id (shortid, local state), value: screen post data - object)
    post_likes: {}, // Global tracking - likes are reflected in all posts on every screen
    none_msg: 'This post does not exist or has been deleted.'
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case STORE_USER_SCREEN_INFO:
      const copyProfile = { ...state.profile };
      const copyPostLikes = { ...state.posts.post_likes, ...action.payload.user.posts.post_likes }; // Add to object to track
      copyProfile[action.payload.user.id] = {
        ...copyProfile[action.payload.user.id],
        [action.payload.screenID]: action.payload.user
      };
      return {
        ...state,
        profile: copyProfile,
        posts: {
          ...state.posts,
          post_likes: copyPostLikes
        }
      };
    case REMOVE_USER_SCREEN_INFO:
      const copyProfile2 = { ...state.profile };
      delete copyProfile2[action.payload.userID][action.payload.screenID];
      if (Object.keys(copyProfile2[action.payload.userID]).length === 0) {
        delete copyProfile2[action.payload.userID];
      }
      return { ...state, profile: copyProfile2 };

    case CREATE_POST:
      const copyProfile3 = { ...state.profile };
      const userScreens = copyProfile3[action.payload.author_id];
      if (userScreens) {
        for (const screenID in userScreens) {
          if (Object.prototype.hasOwnProperty.call(userScreens, screenID)) {
            const posts = userScreens[screenID].posts;
            posts.data[action.payload.id] = action.payload;
            posts.offset++;
            posts.order = [action.payload.id, ...posts.order];
          }
        }
        return { ...state, profile: copyProfile3 };
      }
      return state;
    case EDIT_POST:
      const copyProfile4 = { ...state.profile };
      const copyPostLikes2 = { ...state.posts.post_likes };
      const userScreens2 = copyProfile4[action.payload.post.author_id];
      if (userScreens2) {
        for (const screenID in userScreens2) {
          if (Object.prototype.hasOwnProperty.call(userScreens2, screenID)) {
            const postData = userScreens2[screenID].posts.data;
            // Update post
            if (postData[action.payload.post.id]) {
              postData[action.payload.post.id] = action.payload.post;
            }
          }
        }
      }
      if (action.payload.type === 'num_likes') {
        if (copyPostLikes2[action.payload.post.id]) {
          delete copyPostLikes2[action.payload.post.id];
        } else {
          copyPostLikes2[action.payload.post.id] = true;
        }
      }
      return {
        ...state,
        profile: copyProfile4,
        posts: {
          ...state.posts,
          post_likes: copyPostLikes2
        }
      };
    case DELETE_POST:
      const copyProfile5 = { ...state.profile };
      const userScreens3 = copyProfile5[action.payload.userID];
      if (userScreens3) {
        for (const screenID in userScreens3) {
          if (Object.prototype.hasOwnProperty.call(userScreens3, screenID)) {
            const posts = userScreens3[screenID].posts;
            const index = posts.order.indexOf(action.payload.postID);

            if (index >= 0) {
              delete posts.data[action.payload.postID];
              delete posts.post_likes[action.payload.postID];
              posts.order.splice(index, 1);
              posts.offset--;
            }
          }
        }
      }
      return { ...state, profile: copyProfile5 };

    case GET_USER_FEED:
      return {
        ...state,
        posts: {
          ...state.posts,
          post_likes: {
            ...state.posts.post_likes,
            ...action.payload.post_likes
          }
        }
      };
    default:
      return state;
  }
};
