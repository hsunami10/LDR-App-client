import {
  LOG_OUT_USER,
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO,
  STORE_POST_SCREEN_INFO,
  REMOVE_POST_SCREEN_INFO,
  CREATE_POST,
  DELETE_POST,
  START_INITIAL_USER_SCREEN_LOADING,
  STOP_INITIAL_USER_SCREEN_LOADING,
  START_USER_SCREEN_REFRESHING,
  STOP_USER_SCREEN_REFRESHING,
} from '../actions/types';

// NOTE: Only use this if there will be MULTIPLE screens with DIFFERENT data
// Or if it would be the same for all screens (ex: post likes - posts.post_likes)
// Centralized place to hold different data for multiple same screens (ex: multiple ViewProfileScreens w/ diff users)
// ex. Loading - different screens have their own loading indicators

const INITIAL_STATE = {
  profile: { // user_id : { screen_id1: {}, screen_id2: {}, ... }, user_id2...
    none_msg: 'This account does not exist or has been deleted.',
    '': { '': { loading: true } }
  },
  posts: { // Only holds ViewPostScreen loading properties and comment properties (offset, orderArray, etc.)
    none_msg: 'This post has been deleted.',
    '': { '': { loading: true } }
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case START_INITIAL_USER_SCREEN_LOADING:
      const copyP = { ...state.profile };
      copyP[action.payload.userID] = {
        ...copyP[action.payload.userID],
        [action.payload.screenID]: {
          initial_loading: true,
          refreshing: false
        }
      };
      return { ...state, profile: copyP };
    case STOP_INITIAL_USER_SCREEN_LOADING:
      const copyP2 = { ...state.profile };
      copyP2[action.payload.userID] = {
        ...copyP2[action.payload.userID],
        [action.payload.screenID]: {
          ...copyP2[action.payload.userID][action.payload.screenID],
          initial_loading: false
        }
      };
      return { ...state, profile: copyP2 };
    case START_USER_SCREEN_REFRESHING:
      const copyProf = { ...state.profile };
      copyProf[action.payload.userID] = {
        ...copyProf[action.payload.userID],
        [action.payload.screenID]: {
          ...copyProf[action.payload.userID][action.payload.screenID],
          refreshing: true
        }
      };
      return { ...state, profile: copyProf };
    case STOP_USER_SCREEN_REFRESHING:
      const copyProf2 = { ...state.profile };
      copyProf2[action.payload.userID] = {
        ...copyProf2[action.payload.userID],
        [action.payload.screenID]: {
          ...copyProf2[action.payload.userID][action.payload.screenID],
          refreshing: false
        }
      };
      return { ...state, profile: copyProf2 };

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

    case STORE_POST_SCREEN_INFO: // TODO: Change later
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
