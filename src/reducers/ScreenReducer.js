import {
  LOG_OUT_USER,
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO,
  STORE_POST_SCREEN_INFO,
  REMOVE_POST_SCREEN_INFO,
  CREATE_POST,
  DELETE_POST
} from '../actions/types';

// NOTE: Only use this if there will be MULTIPLE screens with DIFFERENT data
// Or if it would be the same for all screens (ex: post likes - posts.post_likes)

const INITIAL_STATE = {
  profile: { // key: user_id, value: object of (key: screen_id (shortid, local state), value: screen user data - object)
    none_msg: 'This account does not exist or has been deleted.'
  },
  comments: { // Same format as posts, make it more neat and less nested
    comment_likes: {},
    none_msg: 'There are no comments for this post.'
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case STORE_USER_SCREEN_INFO:
      const copyProfile = { ...state.profile };
      copyProfile[action.payload.user.id] = {
        ...copyProfile[action.payload.user.id],
        [action.payload.screenID]: action.payload.user
      };
      return { ...state, profile: copyProfile };
    case REMOVE_USER_SCREEN_INFO:
      const copyProfile2 = { ...state.profile };
      delete copyProfile2[action.payload.userID][action.payload.screenID];
      if (Object.keys(copyProfile2[action.payload.userID]).length === 0) {
        delete copyProfile2[action.payload.userID];
      }
      return { ...state, profile: copyProfile2 };

    case STORE_POST_SCREEN_INFO:
      const copyPosts = { ...state.posts };
      const copyComments = { ...state.comments };
      copyPosts[action.payload.post.id] = {
        ...copyPosts[action.payload.post.id],
        [action.payload.screenID]: action.payload.post
      };
      copyComments[action.payload.post.id] = {
        ...copyComments[action.payload.post.id],
        [action.payload.screenID]: action.payload.comments
      };
      return {
        ...state,
        posts: copyPosts,
        comments: copyComments
      };
    case REMOVE_POST_SCREEN_INFO:
      const copyPosts2 = { ...state.posts };
      const copyComments2 = { ...state.comments };
      delete copyPosts2[action.payload.postID][action.payload.screenID];
      if (Object.keys(copyPosts2[action.payload.postID]).length === 0) {
        delete copyPosts2[action.payload.postID];
      }
      delete copyComments2[action.payload.postID][action.payload.screenID];
      if (Object.keys(copyComments2[action.payload.postID]).length === 0) {
        delete copyComments2[action.payload.postID];
      }
      return {
        ...state,
        posts: copyPosts2,
        comments: copyComments2
      };

    case CREATE_POST:
      const copyProfile3 = { ...state.profile };
      const userScreens = copyProfile3[action.payload.author_id];
      if (userScreens) {
        for (const screenID in userScreens) {
          if (Object.prototype.hasOwnProperty.call(userScreens, screenID)) {
            const posts = userScreens[screenID].posts;
            posts.offset++;
            posts.order = [action.payload.id, ...posts.order];
          }
        }
        return { ...state, profile: copyProfile3 };
      }
      return state;
    case DELETE_POST:
      const copyProfile5 = { ...state.profile };
      const userScreens3 = copyProfile5[action.payload.userID];
      if (userScreens3) {
        for (const screenID in userScreens3) {
          if (Object.prototype.hasOwnProperty.call(userScreens3, screenID)) {
            const posts = userScreens3[screenID].posts;
            const index = posts.order.indexOf(action.payload.postID);

            if (index >= 0) {
              posts.order.splice(index, 1);
              posts.offset--;
            }
          }
        }
      }
      return { ...state, profile: copyProfile5 };
    default:
      return state;
  }
};
