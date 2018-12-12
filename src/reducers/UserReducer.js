import {
  LOG_OUT_USER,
  STORE_USER_INFO,
  START_USER_SCREEN_REFRESHING, // TODO: Remove all of these later
  STOP_USER_SCREEN_REFRESHING,
  START_INITIAL_USER_SCREEN_LOADING,
  STOP_INITIAL_USER_SCREEN_LOADING,
  RESET_USER_ERRORS,
  ACCEPT_PARTNER_RESULT_SUCCESS,
  ACCEPT_PARTNER_RESULT_FAILURE,
  STORE_PARTNER_RESULT,
  REMOVE_PARTNER_RESULT,
  START_FIND_PARTNER_LOADING,
  STOP_FIND_PARTNER_LOADING,
} from '../actions/types';

/*{ // TODO: Change default to null - testing purposes only
  id: '0aa1e4d0-d006-4a0c-9e3e-3fa04c8080c1',
  username: 'asdf',
  profile_pic: 'images/profiles/0aa1e4d0-d006-4a0c-9e3e-3fa04c8080c1.JPG',
  date_joined: '1542516387'
}*/

// TODO: Add default values for subscribers && friends later
const INITIAL_STATE = {
  id: '',
  coordinates: null,
  initial_loading: false,
  loading: false,
  partner_result: null, // Basic info on user when searching up a partner code
  partner_error_msg: 'No partner found, or code has expired.', // NOTE: Make sure it's the same as ScreenReducer
  find_partner_loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;
    case RESET_USER_ERRORS:
      return { ...state, partner_error_msg: ' ' };

    case STORE_PARTNER_RESULT:
      if (action.payload.success) {
        return { ...state, partner_result: action.payload.result };
      }
      return { ...state, partner_result: null, partner_error_msg: INITIAL_STATE.partner_error_msg };
    case REMOVE_PARTNER_RESULT:
      return { ...state, partner_result: null };
    case ACCEPT_PARTNER_RESULT_SUCCESS:
      return { ...state, partner_result: null, partner_error_msg: action.payload.message };
    case ACCEPT_PARTNER_RESULT_FAILURE:
      return { ...state, partner_result: null, partner_error_msg: action.payload };

    // Loading action types for refreshing your own profile page
    case START_USER_SCREEN_REFRESHING:
      return { ...state, loading: true };
    case STOP_USER_SCREEN_REFRESHING:
      return { ...state, loading: false };
    case START_INITIAL_USER_SCREEN_LOADING:
      return { ...state, initial_loading: true };
    case STOP_INITIAL_USER_SCREEN_LOADING:
      return { ...state, initial_loading: false };

    case START_FIND_PARTNER_LOADING:
      if (!action.payload) {
        return { ...state, find_partner_loading: true };
      }
      return state;
    case STOP_FIND_PARTNER_LOADING:
      if (!action.payload) {
        return { ...state, find_partner_loading: false };
      }
      return state;

    case STORE_USER_INFO:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
