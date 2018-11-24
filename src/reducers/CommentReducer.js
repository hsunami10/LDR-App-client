import {
  LOG_OUT_USER,
  STORE_COMMENTS_SCREEN_INFO,
  DELETE_COMMENT
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

    case STORE_COMMENTS_SCREEN_INFO:
      return {
        ...state,
        comment_likes: { ...state.comment_likes, ...action.payload.data.comment_likes },
        all_comments: { ...state.all_comments, ...action.payload.data.comments }
      };

    case DELETE_COMMENT:
      const copyComs = { ...state.all_comments };
      const copyComLikes = { ...state.comment_likes };
      delete copyComs[action.payload.commentID];
      delete copyComLikes[action.payload.commentID];
      return {
        ...state,
        comment_likes: copyComLikes,
        all_comments: copyComs
      };
    default:
      return state;
  }
};
