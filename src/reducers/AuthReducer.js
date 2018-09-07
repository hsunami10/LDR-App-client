import {
  START_LOADING,
  STOP_LOADING
} from '../actions/types';

const INITIAL_STATE = {
  uid: '',
  email: '',
  user: null,
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, loading: true };
    case STOP_LOADING:
      return { ...state, loading: false };
    default:
      return state;
  }
};
