import {
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
    case SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS:
      return { ...state, uid: action.payload };
    default:
      return state;
  }
};
