import {
  LOG_OUT_USER,
  STORE_POST_SCREEN_INFO
} from '../actions/types';

// Holds data for all comments - want all comments to be the same across screens
const INITIAL_STATE = {
  none_msg: 'There are no comments for this post.',
  comment_likes: {},
  all_comments: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case STORE_POST_SCREEN_INFO:
      // TODO: Finish later
      return state;
    default:
      return state;
  }
};
