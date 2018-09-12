import {
  START_OVERLAY_LOADING,
  STOP_OVERLAY_LOADING,
  SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS
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
    case START_OVERLAY_LOADING:
      return { ...state, loading: true };
    case STOP_OVERLAY_LOADING:
      return { ...state, loading: false };
    case SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS:
      return { ...state, uid: action.payload };
    default:
      return state;
  }
};
