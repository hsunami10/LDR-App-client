import {
  LOG_OUT_USER,
  STORE_USER_SCREEN_INFO_SUCCESS,
  STORE_USER_SCREEN_INFO_FAILURE,
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
  INIT_POST_SCREEN_INFO,
  START_COMMENTS_PAGE_LOADING,
  STOP_COMMENTS_PAGE_LOADING,

  ACCEPT_PARTNER_RESULT_SUCCESS,
  STORE_PARTNER_RESULT_SUCCESS,
  REMOVE_PARTNER_RESULT,
  START_FIND_PARTNER_LOADING,
  STOP_FIND_PARTNER_LOADING,
} from '../actions/types';

// NOTE: Only use this if there will be MULTIPLE screens with DIFFERENT data
// Or if it would be the same for all screens (ex: post likes - posts.post_likes)
// Centralized place to hold different data for multiple same screens (ex: multiple ViewProfileScreens w/ diff users)
// ex. Loading - different screens have their own loading indicators

const INITIAL_STATE = {
  profiles: { // ViewProfileScreen - user_id : { screen_id1: {}, screen_id2: {}, ... }, user_id2...
    // Holds all profile information
    none_msg: 'This account does not exist or has been deleted.'
  },
  posts: { // ViewPostScreen - post_id : { screen_id1: {}, screen_id2: {}, ... }, post_id2...
    // Holds comments-related properties, loading properties
    none_msg: 'This post has been deleted.'
  },
  topics: { // VIewTopicScreen - topic_id : { screen_id1: {}, screen_id2: {}, ... }, topic_id2...
    // Holds all topic information
    none_msg: 'This topic does not exist or has been deleted.'
  },
  partners: { // NOTE: Screens for - editing columns in partners table
    // NOTE: Have these for each partners screen
    // One for generating a code (for someone else to enter the code)
    // Another for entering the code
    generate_code_loading: false,
    find_partner_loading: false,
    partner_error_msg: 'No Partner Found.' // NOTE: Make sure it's the same as UserReducer
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case START_FIND_PARTNER_LOADING:
      if (action.payload) {
        // TODO: Finish this
        console.log('return and change screen state here');
      }
      return state;
    case STOP_FIND_PARTNER_LOADING:
      // TODO: Finish this
      if (action.payload) {
        console.log('return and change screen state here');
      }
      return state;

    case STORE_COMMENTS_SCREEN_INFO:
      const copyPosts = { ...state.posts };
      copyPosts[action.payload.postID] = {
        ...copyPosts[action.payload.postID],
        [action.payload.screenID]: {
          ...copyPosts[action.payload.postID][action.payload.screenID],
          offset: action.payload.data.offset,
          order: (
            action.payload.replace ?
            action.payload.data.order : [...action.payload.data.order, ...copyPosts[action.payload.postID][action.payload.screenID].order]
          ),
          keepPaging: ( // If keepPaging is false, never change it - only change if keepPaging is true - default
            copyPosts[action.payload.postID][action.payload.screenID].keepPaging ?
            action.payload.keepPaging :
            false
          ),
          initial_comments_loading: false
        }
      };
      return { ...state, posts: copyPosts };
      // NOTE: This runs first out of all of the actions related to ViewPostScreen
      // So treat it as initialization (initial state)
    case INIT_POST_SCREEN_INFO:
      const copyPosts2 = { ...state.posts };
      copyPosts2[action.payload.postID] = {
        ...copyPosts2[action.payload.postID],
        [action.payload.screenID]: {
          refreshing: false,
          page_comments_loading: false,
          order: [],
          offset: 0,
          keepPaging: true
        }
      };
      return { ...state, posts: copyPosts2 };
    case REMOVE_POST_SCREEN_INFO:
      const copyPosts8 = { ...state.posts };
      if (copyPosts8.hasOwnProperty(action.payload.postID)) {
        delete copyPosts8[action.payload.postID][action.payload.screenID];
      }
      if (Object.keys(copyPosts8[action.payload.postID]).length === 0) {
        delete copyPosts8[action.payload.postID];
      }
      return { ...state, posts: copyPosts8 };
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
    case DELETE_COMMENT:
      const copyPosts9 = { ...state.posts };
      const postScreens = copyPosts9[action.payload.postID];
      if (postScreens) {
        for (const screenID in postScreens) {
          if (postScreens.hasOwnProperty(screenID)) {
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

    case STORE_USER_SCREEN_INFO_SUCCESS:
      const copyProfile = { ...state.profiles };
      copyProfile[action.payload.user.id] = {
        ...copyProfile[action.payload.user.id],
        [action.payload.screenID]: action.payload.user
      };
      return { ...state, profiles: copyProfile };
    case STORE_USER_SCREEN_INFO_FAILURE:
      const copyProfile1 = { ...state.profiles };
      copyProfile1[action.payload.userID] = {
        ...copyProfile1[action.payload.userID],
        [action.payload.screenID]: {}
      };
      return { ...state, profiles: copyProfile1 };
    case REMOVE_USER_SCREEN_INFO:
      const copyProfile2 = { ...state.profiles };
      if (copyProfile2.hasOwnProperty(action.payload.userID)) {
        delete copyProfile2[action.payload.userID][action.payload.screenID];
      }
      if (Object.keys(copyProfile2[action.payload.userID]).length === 0) {
        delete copyProfile2[action.payload.userID];
      }
      return { ...state, profiles: copyProfile2 };

    case CREATE_POST:
      const copyProfile3 = { ...state.profiles };
      const userScreens = copyProfile3[action.payload.author_id];
      if (userScreens) {
        for (const screenID in userScreens) {
          if (userScreens.hasOwnProperty(screenID)) {
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
          if (userScreens3.hasOwnProperty(screenID)) {
            // Handle user profile posts & interactions
            const posts = userScreens3[screenID].posts;
            const interactions = userScreens3[screenID].interactions;

            const index = posts.order.indexOf(action.payload.postID);
            const index2 = interactions.order.indexOf(action.payload.postID);

            if (index >= 0) {
              posts.order.splice(index, 1);
              posts.offset--;
            }
            if (index2 >= 0) {
              interactions.order.splice(index2, 1);
              interactions.offset--;
            }
          }
        }
      }
      return { ...state, profiles: copyProfile5 };
    default:
      return state;
  }
};
