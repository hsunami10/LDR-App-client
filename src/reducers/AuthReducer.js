import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_CREDENTIALS,
  SET_NOT_FIRST_LOG_IN
} from '../actions/types';
import { handleError } from '../assets/helpers';

const INITIAL_STATE = {
  id: '',
  first_login: false,
  email: '',
  user: null,
  error_field: '', // 'username', 'password', 'both'
  error_msg: ' ', // Text error message
  success: false, // Differentiate between red and green text
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_AUTH_ERRORS: {
      const { errorField, errorMsg, success } = action.payload;
      if (errorField === 'username' || errorField === 'password' || errorField === '') {
        return {
          ...state,
          error_field: errorField,
          error_msg: errorMsg,
          success
        };
      }
      handleError(new Error('Invalid field type in SET_AUTH_ERRORS'));
      break;
    }
    case RESET_AUTH_ERRORS:
      return { ...state, error_field: '', error_msg: ' ', success: false };
    case SET_USER_CREDENTIALS:
      return { ...state, id: action.payload.id, first_login: action.payload.firstLogin };
    case SET_NOT_FIRST_LOG_IN:
      return { ...state, first_login: false };
    default:
      return state;
  }
};
