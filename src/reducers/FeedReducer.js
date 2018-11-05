import {
  LOG_OUT_USER,
  CREATE_POST
} from '../actions/types';

const INITIAL_STATE = [];

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;
    case CREATE_POST:
      return [action.payload, ...state];
    default:
      return state;
  }
};
