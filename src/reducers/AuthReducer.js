import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS,
} from '../actions/types';
import { handleError } from '../assets/helpers';

const INITIAL_STATE = {
  uid: '',
  email: '',
  user: null,
  error_field: '', // 'username', 'password', 'both'
  error_msg: ' ', // Text error message
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AUTH_ERRORS: {
      const { errorField, errorMsg } = action.payload;
      if (errorField === 'username' || errorField === 'password' || errorField === '') {
        return {
          ...state,
          error_field: errorField,
          error_msg: errorMsg
        };
      }
      handleError(new Error('Invalid field type in SET_AUTH_ERRORS'));
      break;
    }
    case RESET_AUTH_ERRORS:
      return { ...state, error_field: '', error_msg: ' ' };
    case SIGN_UP_USERNAME_AND_PASSWORD_SUCCESS:
      return { ...state, uid: action.payload };
    default:
      return state;
  }
};
