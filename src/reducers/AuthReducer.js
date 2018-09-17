import {
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_ID
} from '../actions/types';
import { handleError } from '../assets/helpers';

const INITIAL_STATE = {
  id: '',
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
      return { ...state, error_field: '', error_msg: ' ', success: true };
    case SET_USER_ID:
      return { ...state, id: action.payload };
    default:
      return state;
  }
};
