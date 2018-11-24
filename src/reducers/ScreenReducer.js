import {
  LOG_OUT_USER,
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO,
  REMOVE_POST_SCREEN_INFO,
  CREATE_POST,
  DELETE_POST,
  DELETE_COMMENT,
  START_INITIAL_USER_SCREEN_LOADING,
  STOP_INITIAL_USER_SCREEN_LOADING,
  START_USER_SCREEN_REFRESHING,
  STOP_USER_SCREEN_REFRESHING,
  START_POST_SCREEN_REFRESHING,
  STOP_POST_SCREEN_REFRESHING,
  STORE_COMMENTS_SCREEN_INFO,
  START_INITIAL_COMMENTS_LOADING,
  STOP_INITIAL_COMMENTS_LOADING,
  START_COMMENTS_PAGE_LOADING,
  STOP_COMMENTS_PAGE_LOADING,
} from '../actions/types';

// NOTE: Only use this if there will be MULTIPLE screens with DIFFERENT data
// Or if it would be the same for all screens (ex: post likes - posts.post_likes)
// Centralized place to hold different data for multiple same screens (ex: multiple ViewProfileScreens w/ diff users)
// ex. Loading - different screens have their own loading indicators

const INITIAL_STATE = {
  profiles: { // user_id : { screen_id1: {}, screen_id2: {}, ... }, user_id2...
    none_msg: 'This account does not exist or has been deleted.'
  },
  // TODO: ViewPostScreen loading properties and comment properties (offset, orderArray, etc.)
  posts: { // post_id : { screen_id1: {}, screen_id2: {}, ... }, post_id2...
    none_msg: 'This post has been deleted.'
  },
  topics: { // topic_id : { screen_id1: {}, screen_id2: {}, ... }, topic_id2...
    none_msg: 'This topic does not exist or has been deleted.'
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case STORE_COMMENTS_SCREEN_INFO:
      const copyPosts = { ...state.posts };
      copyPosts[action.payload.postID] = {
        ...copyPosts[action.payload.postID],
        [action.payload.screenID]: {
          ...copyPosts[action.payload.postID][action.payload.screenID],
          offset: action.payload.data.offset,
          order: (
            action.payload.replace ?
            action.payload.data.order :
            [...action.payload.data.order, ...copyPosts[action.payload.postID][action.payload.screenID].order]
          ),
          keepPaging: action.payload.keepPaging
        }
      };
      return { ...state, posts: copyPosts };
    // NOTE: This runs first out of all of the actions related to ViewPostScreen
    // So treat it as initialization (initial state)
    case START_INITIAL_COMMENTS_LOADING:
      const copyPosts2 = { ...state.posts };
      copyPosts2[action.payload.postID] = {
        ...copyPosts2[action.payload.postID],
        [action.payload.screenID]: {
          initial_comments_loading: true,
          refreshing: false,
          page_comments_loading: false,
          order: [],
          offset: 0,
          keepPaging: false
        }
      };
      return { ...state, posts: copyPosts2 };
    case STOP_INITIAL_COMMENTS_LOADING:
      const copyPosts3 = { ...state.posts };
      copyPosts3[action.payload.postID] = {
        ...copyPosts3[action.payload.postID],
        [action.payload.screenID]: {
          ...copyPosts3[action.payload.postID][action.payload.screenID],
          initial_comments_loading: false
        }
      };
      return { ...state, posts: copyPosts3 };
    case START_COMMENTS_PAGE_LOADING:
      const copyPosts4 = { ...state.posts };
      copyPosts4[action.payload.postID] = {
        ...copyPosts4[action.payload.postID],
        [action.payload.screenID]: {
          ...copyPosts4[action.payload.postID][action.payload.screenID],
          page_comments_loading: true
        }
      };
      return { ...state, posts: copyPosts4 };
    case STOP_COMMENTS_PAGE_LOADING:
      const copyPosts5 = { ...state.posts };
      copyPosts5[action.payload.postID] = {
        ...copyPosts5[action.payload.postID],
        [action.payload.screenID]: {
          ...copyPosts5[action.payload.postID][action.payload.screenID],
          page_comments_loading: false
        }
      };
      return { ...state, posts: copyPosts5 };
    case START_POST_SCREEN_REFRESHING:
      const copyPosts6 = { ...state.posts };
      copyPosts6[action.payload.postID] = {
        ...copyPosts6[action.payload.postID],
        [action.payload.screenID]: {
          ...copyPosts6[action.payload.postID][action.payload.screenID],
          refreshing: true
        }
      };
      return { ...state, posts: copyPosts6 };
    case STOP_POST_SCREEN_REFRESHING:
      const copyPosts7 = { ...state.posts };
      copyPosts7[action.payload.postID] = {
        ...copyPosts7[action.payload.postID],
        [action.payload.screenID]: {
          ...copyPosts7[action.payload.postID][action.payload.screenID],
          refreshing: false
        }
      };
      return { ...state, posts: copyPosts7 };
    case REMOVE_POST_SCREEN_INFO:
      const copyPosts8 = { ...state.posts };
      delete copyPosts8[action.payload.postID][action.payload.screenID];
      if (Object.keys(copyPosts8[action.payload.postID]).length === 0) {
        delete copyPosts8[action.payload.postID];
      }
      return { ...state, posts: copyPosts8 };
    case DELETE_COMMENT:
      const copyPosts9 = { ...state.posts };
      const postScreens = copyPosts9[action.payload.postID];
      if (postScreens) {
        for (const screenID in postScreens) {
          if (Object.prototype.hasOwnProperty.call(postScreens, screenID)) {
            const screen = postScreens[screenID];
            const index = screen.order.indexOf(action.payload.commentID);

            if (index >= 0) {
              screen.order.splice(index, 1);
              screen.offset--;
            }
          }
        }
      }
      return { ...state, posts: copyPosts9 };
    case START_INITIAL_USER_SCREEN_LOADING:
      const copyP = { ...state.profiles };
      copyP[action.payload.userID] = {
        ...copyP[action.payload.userID],
        [action.payload.screenID]: {
          initial_loading: true,
          refreshing: false
        }
      };
      return { ...state, profiles: copyP };
    case STOP_INITIAL_USER_SCREEN_LOADING:
      const copyP2 = { ...state.profiles };
      copyP2[action.payload.userID] = {
        ...copyP2[action.payload.userID],
        [action.payload.screenID]: {
          ...copyP2[action.payload.userID][action.payload.screenID],
          initial_loading: false
        }
      };
      return { ...state, profiles: copyP2 };
    case START_USER_SCREEN_REFRESHING:
      const copyProf = { ...state.profiles };
      copyProf[action.payload.userID] = {
        ...copyProf[action.payload.userID],
        [action.payload.screenID]: {
          ...copyProf[action.payload.userID][action.payload.screenID],
          refreshing: true
        }
      };
      return { ...state, profiles: copyProf };
    case STOP_USER_SCREEN_REFRESHING:
      const copyProf2 = { ...state.profiles };
      copyProf2[action.payload.userID] = {
        ...copyProf2[action.payload.userID],
        [action.payload.screenID]: {
          ...copyProf2[action.payload.userID][action.payload.screenID],
          refreshing: false
        }
      };
      return { ...state, profiles: copyProf2 };

    case STORE_USER_SCREEN_INFO:
      const copyProfile = { ...state.profiles };
      copyProfile[action.payload.user.id] = {
        ...copyProfile[action.payload.user.id],
        [action.payload.screenID]: action.payload.user
      };
      return { ...state, profiles: copyProfile };
    case REMOVE_USER_SCREEN_INFO:
      const copyProfile2 = { ...state.profiles };
      delete copyProfile2[action.payload.userID][action.payload.screenID];
      if (Object.keys(copyProfile2[action.payload.userID]).length === 0) {
        delete copyProfile2[action.payload.userID];
      }
      return { ...state, profiles: copyProfile2 };

    case CREATE_POST:
      const copyProfile3 = { ...state.profiles };
      const userScreens = copyProfile3[action.payload.author_id];
      if (userScreens) {
        for (const screenID in userScreens) {
          if (Object.prototype.hasOwnProperty.call(userScreens, screenID)) {
            const posts = userScreens[screenID].posts;
            posts.offset++;
            posts.order = [action.payload.id, ...posts.order];
          }
        }
        return { ...state, profiles: copyProfile3 };
      }
      return state;
    case DELETE_POST:
      const copyProfile5 = { ...state.profiles };
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
      return { ...state, profiles: copyProfile5 };
    default:
      return state;
  }
};
