import {
  LOG_OUT_USER,
  START_INITIAL_SOCIAL_LOADING,
  STOP_INITIAL_SOCIAL_LOADING,
  START_SOCIAL_REFRESHING,
  STOP_SOCIAL_REFRESHING,
  GET_SOCIAL_INFO,
} from '../actions/types';

const INITIAL_STATE = {
  initial_loading: false,
  refreshing: false,
  requests: {
    order: []
  },
  pending: {
    order: []
  },
  friends: {
    order: [],
    offset: 0
  },
  keepPaging: false,
  all_users: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;
    case START_INITIAL_SOCIAL_LOADING:
      return { ...state, initial_loading: true };
    case STOP_INITIAL_SOCIAL_LOADING:
      return { ...state, initial_loading: false };
    case START_SOCIAL_REFRESHING:
      return { ...state, refreshing: true };
    case STOP_SOCIAL_REFRESHING:
      return { ...state, refreshing: false };

    case GET_SOCIAL_INFO:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
