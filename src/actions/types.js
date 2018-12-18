// Include in every reducer
export const LOG_OUT_USER = 'log_out_user';

// Loading
export const START_OVERLAY_LOADING = 'start_overlay_loading';
export const STOP_OVERLAY_LOADING = 'stop_overlay_loading';

// User
export const STORE_USER_INFO = 'store_user_info';
export const RESET_USER_ERRORS = 'reset_user_errors';
export const STORE_PARTNER_RESULT_SUCCESS = 'store_partner_result_success';
export const STORE_PARTNER_RESULT_FAILURE = 'store_partner_result_failure';
export const REMOVE_PARTNER_RESULT = 'remove_partner_result';
export const ACCEPT_PARTNER_RESULT_SUCCESS = 'accept_partner_result_success';
export const ACCEPT_PARTNER_RESULT_FAILURE = 'accept_partner_result_failure';
export const START_FIND_PARTNER_LOADING = 'start_find_partner_loading';
export const STOP_FIND_PARTNER_LOADING = 'stop_find_partner_loading';

// Authentication
export const SET_USER_CREDENTIALS = 'set_user_credentials';
export const SET_AUTH_ERRORS = 'set_auth_errors';
export const RESET_AUTH_ERRORS = 'reset_auth_errors';
export const SET_NOT_FIRST_LOG_IN = 'set_not_first_log_in';

// Screen Users
export const STORE_USER_SCREEN_INFO_SUCCESS = 'store_user_screen_info_success';
export const STORE_USER_SCREEN_INFO_FAILURE = 'store_user_screen_info_failure';
export const REMOVE_USER_SCREEN_INFO = 'remove_user_screen_info';
export const START_USER_SCREEN_REFRESHING = 'start_user_screen_refreshing';
export const STOP_USER_SCREEN_REFRESHING = 'stop_user_screen_refreshing';
export const START_INITIAL_USER_SCREEN_LOADING = 'start_initial_user_screen_loading';
export const STOP_INITIAL_USER_SCREEN_LOADING = 'stop_initial_user_screen_loading';

// Screen Posts
export const REMOVE_POST_SCREEN_INFO = 'remove_post_screen_info';
export const START_POST_SCREEN_REFRESHING = 'start_post_screen_refreshing';
export const STOP_POST_SCREEN_REFRESHING = 'stop_post_screen_refreshing';
export const INIT_POST_SCREEN_INFO = 'init_post_screen_info';

// Screen Comments
export const STORE_COMMENTS_SCREEN_INFO = 'store_comments_screen_info';
export const START_COMMENTS_PAGE_LOADING = 'start_comments_page_loading';
export const STOP_COMMENTS_PAGE_LOADING = 'stop_comments_page_loading';


// Navigation
export const GO_BACKWARD_ROUTE = 'go_backward_route';
export const GO_BACKWARD_TAB_ROUTE = 'go_backward_tab_route';
export const REPLACE_CURRENT_ROUTE = 'replace_current_route';
export const NAVIGATE_TO_ROUTE = 'navigate_to_route';
export const PUSH_TAB_ROUTE = 'push_tab_route';
export const SWITCH_TABS = 'switch_tabs';

// Topics
export const CREATE_TOPIC = 'create_topic';
export const DELETE_TOPIC = 'delete_topic'; // only admin users can delete topics, admins of groups cannot delete
export const START_TOPIC_LOADING = 'start_topic_loading';
export const STOP_TOPIC_LOADING = 'stop_topic_loading';
export const START_TOPIC_REFRESHING = 'start_topic_refreshing';
export const STOP_TOPIC_REFRESHING = 'stop_topic_refreshing';
export const CHOOSE_POST_TOPIC = 'choose_post_topic';
export const GET_SUBSCRIBED_TOPICS = 'get_subscribed_topics';
export const SUBSCRIBE_TOPIC = 'subscribe_topic';
export const UNSUBSCRIBE_TOPIC = 'unsubscribe_topic';

// Posts
export const CREATE_POST = 'create_post';
export const DELETE_POST = 'delete_post';
export const EDIT_POST = 'edit_post';

// Comments
export const DELETE_COMMENT = 'delete_comment';
export const EDIT_COMMENT = 'edit_comment';

// Feed
export const START_FEED_LOADING = 'start_feed_loading';
export const STOP_FEED_LOADING = 'stop_feed_loading';
export const START_INITIAL_FEED_LOADING = 'start_initial_feed_loading';
export const STOP_INITIAL_FEED_LOADING = 'stop_initial_feed_loading';
export const GET_USER_FEED = 'get_user_feed';
export const SORT_FEED = 'sort_feed';

// Social
export const START_INITIAL_SOCIAL_LOADING = 'start_initial_social_loading';
export const STOP_INITIAL_SOCIAL_LOADING = 'stop_initial_social_loading';
export const START_SOCIAL_REFRESHING = 'start_social_refreshing';
export const STOP_SOCIAL_REFRESHING = 'stop_social_refreshing';
export const GET_SOCIAL_INFO = 'get_social_info';
export const GET_USER_FRIENDS = 'get_user_friends';
export const REMOVE_FRIEND_REQUEST = 'remove_friend_request';
export const SEND_FRIEND_REQUEST = 'send_friend_request';
export const ACCEPT_FRIEND_REQUEST = 'accept_friend_request';
export const REJECT_FRIEND_REQUEST = 'reject_friend_request';
export const REMOVE_PENDING_REQUEST = 'remove_pending_request';
export const CANCEL_PENDING_REQUEST = 'cancel_pending_request';
export const REMOVE_FRIEND = 'remove_friend';
export const UNFRIEND_USER = 'unfriend_user';

// Discover Posts
export const START_INITIAL_DISCOVER_POSTS_LOADING = 'start_initial_discover_posts_loading';
export const STOP_INITIAL_DISCOVER_POSTS_LOADING = 'stop_initial_discover_posts_loading';
export const START_DISCOVER_POSTS_REFRESHING = 'start_discover_posts_refreshing';
export const STOP_DISCOVER_POSTS_REFRESHING = 'stop_discover_posts_refreshing';
export const GET_DISCOVER_POSTS = 'get_discover_posts';

// Discover Users
export const START_INITIAL_DISCOVER_USERS_LOADING = 'start_initial_discover_users_loading';
export const STOP_INITIAL_DISCOVER_USERS_LOADING = 'stop_initial_discover_users_loading';
export const START_DISCOVER_USERS_REFRESHING = 'start_discover_users_refreshing';
export const STOP_DISCOVER_USERS_REFRESHING = 'stop_discover_users_refreshing';
export const GET_DISCOVER_USERS = 'get_discover_users';

// Discover Topics
export const START_INITIAL_DISCOVER_TOPICS_LOADING = 'start_initial_discover_topics_loading';
export const STOP_INITIAL_DISCOVER_TOPICS_LOADING = 'stop_initial_discover_topics_loading';
export const START_DISCOVER_TOPICS_REFRESHING = 'start_discover_topics_refreshing';
export const STOP_DISCOVER_TOPICS_REFRESHING = 'stop_discover_topics_refreshing';
export const GET_DISCOVER_TOPICS = 'get_discover_topics';
