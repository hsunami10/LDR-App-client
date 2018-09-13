import {
  SHOW_FATAL_ERROR,
  CLOSE_FATAL_ERROR,
  START_OVERLAY_LOADING,
  STOP_OVERLAY_LOADING,
  SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  uid: '',
  email: '',
  user: null,
  error_msg: '',
  loading: false,
  fatal_title: '' // If not empty, then show alert
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_FATAL_ERROR:
      return {
        ...state,
        fatal_title: action.payload.title,
        error_msg: action.payload.msg
      };
    case CLOSE_FATAL_ERROR:
      return {
        ...state,
        fatal_title: '',
        error_msg: ''
      };
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
