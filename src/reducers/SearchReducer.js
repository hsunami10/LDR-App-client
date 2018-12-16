import {
  LOG_OUT_USER,
  DELETE_POST,
} from '../actions/types';

const INITIAL_STATE = {
  home: {},
  discover: {}
};

// TODO: Finish search feed and discover actions
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case DELETE_POST:
      return state;
    default:
      return state;
  }
};
