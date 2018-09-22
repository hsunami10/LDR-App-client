import { Header } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

export const ROOT_URL = (
  process.env.NODE_ENV === undefined ||
  process.env.NODE_ENV === 'development' ?
  'http://10.0.0.24:3000' : 'http://10.0.0.24:3000');
// BUG: Using public IP addresses doesn't work? Can't access server - blocked?
// Only using private IP addresses works on simulator, but doesn't work on phone with cell service
// TODO: Add production URL
// NOTE: Change IP address to laptop's current IP address when needed

export const MIN_LOADING_TIME = 1000; // Minimum time to show loading indicator

export const MIN_HEADER_HEIGHT = Header.HEIGHT; // Minimum header height (including status bar)
export const MIN_HEADER_HEIGHT_NO_STATUS_BAR = MIN_HEADER_HEIGHT - getStatusBarHeight(true);

// NOTE: Change this in server/config/mail.js if changed
export const EmailSubjectEnum = Object.freeze({
  password: 0, // forgotten password
  verification: 1, // email verification - send code
  report_user: 2,
  report_bug: 3,
  new_topic: 4, // requesting new topic
  polls: 5, // sending polls to users
  dev_updates: 6, // sending developer updates to users
  new_ideas: 7, // send new feature ideas to developer team
  feedback: 8 // general feedback from users
});
