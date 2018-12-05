import {
  LOG_OUT_USER
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

    default:
      return state;
  }
};
