import {
  SPLASH_SCREEN_STOP_LOADING
} from '../actions/types';

const INITIAL_STATE = {
  uid: '',
  email: '',
  user: null,
  error: '',
  splash_loading: true,
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SPLASH_SCREEN_STOP_LOADING:
      return { ...state, splash_loading: false };
    default:
      return state;
  }
};
