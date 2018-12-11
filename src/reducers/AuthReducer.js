import {
  LOG_OUT_USER,
  SET_AUTH_ERRORS,
  RESET_AUTH_ERRORS,
  SET_USER_CREDENTIALS,
  SET_NOT_FIRST_LOG_IN
} from '../actions/types';

const INITIAL_STATE = {
  id: '',
  first_login: false,
  forgot_password_error: ' ', // Error message to display
  forgot_password_field: '', // Text input to show red "error" border
  forgot_password_success: false, // Display red or green text
  log_in_error: ' ',
  log_in_field: '',
  log_in_success: false, // Never used
  sign_up_error: ' ',
  sign_up_field: '',
  sign_up_success: false, // Never used
  verify_email_error: ' ',
  verify_email_field: '',
  verify_email_success: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case SET_AUTH_ERRORS:
      const { screen, errorField, errorMsg, success } = action.payload;
      return {
        ...state,
        [`${screen}_field`]: errorField,
        [`${screen}_error`]: errorMsg,
        [`${screen}_success`]: success
      };
    case RESET_AUTH_ERRORS:
      return {
        ...state,
        [`${action.payload}_field`]: '',
        [`${action.payload}_error`]: ' ',
        [`${action.payload}_success`]: false
      };
    case SET_USER_CREDENTIALS:
      return { ...state, id: action.payload.id, first_login: action.payload.firstLogin };
    case SET_NOT_FIRST_LOG_IN:
      return { ...state, first_login: false };
    default:
      return state;
  }
};
