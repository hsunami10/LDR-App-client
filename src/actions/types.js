// Authentication
export const SET_USER_CREDENTIALS = 'set_user_credentials';
export const SET_AUTH_ERRORS = 'set_auth_errors';
export const RESET_AUTH_ERRORS = 'reset_auth_errors';
export const SET_NOT_FIRST_LOG_IN = 'set_not_first_log_in';
export const STORE_USER_INFO = 'store_user_info';

// Loading
export const START_OVERLAY_LOADING = 'start_overlay_loading';
export const STOP_OVERLAY_LOADING = 'stop_overlay_loading';

// Navigation
export const GO_BACKWARD_ROUTE = 'go_backward_route';
export const POP_ROUTE = 'pop_route';
export const REPLACE_CURRENT_ROUTE = 'replace_current_route';
export const PUSH_ROUTE = 'push_route';

// Topics
export const CREATE_TOPIC = 'create_topic';
export const DELETE_TOPIC = 'delete_topic'; // only admin users can delete topics, admins of groups cannot delete
// TODO: Edit topic action types here
