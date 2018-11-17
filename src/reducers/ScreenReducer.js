import {
  LOG_OUT_USER,
  STORE_USER_SCREEN_INFO,
  REMOVE_USER_SCREEN_INFO,
  CREATE_POST,
  EDIT_POST
} from '../actions/types';

const INITIAL_STATE = {
  profile: { // key: user_id, value: object of (key: shortid - local state, value: screen user data - object)
    none_msg: 'This account does not exist or has been deleted.',
  },
  search: {
    feed: {},
    discover: {}
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

    case CREATE_POST:
      const copyProfile3 = { ...state.profile };
      const userScreens = copyProfile3[action.payload.author_id];
      if (userScreens) {
        for (const key in userScreens) {
          if (Object.prototype.hasOwnProperty.call(userScreens, key)) {
            const posts = userScreens[key].posts;
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
      const userScreens2 = copyProfile4[action.payload.post.author_id];
      if (userScreens2) {
        for (const key in userScreens2) {
          if (Object.prototype.hasOwnProperty.call(userScreens2, key)) {
            const postData = userScreens2[key].posts.data;
            const postLikes = userScreens2[key].posts.post_likes;

            // Update post
            if (postData[action.payload.post.id]) {
              postData[action.payload.post.id] = action.payload.post;
            }
            if (action.payload.type === 'num_likes') {
              if (postLikes[action.payload.post.id]) {
                delete postLikes[action.payload.post.id];
              } else {
                postLikes[action.payload.post.id] = { post_id: action.payload.post.id };
              }
            }
          }
        }
        return { ...state, profile: copyProfile4 };
      }
      return state;
    default:
      return state;
  }
};
