import {
  LOG_OUT_USER
} from '../actions/types';

const INITIAL_STATE = {
  profile: {
    target_user_id: '',
    target_screen_id: '',
    own_data: {}, // key: shortid (store in local state), value: screen data (object)
    others_data: {} // key: user_id, value: object of (key: shortid - local state, value: screen data - object)
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

    default:
      return state;
  }
};
