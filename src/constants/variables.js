import { Header } from 'react-navigation';
import { getStatusBarHeight } from 'react-native-status-bar-height';

/*
Add IP address to Info.plist for iOS real device
Use the laptop's IP address and make sure the device is connected to the same wifi
 */
export const ROOT_URL = (
  process.env.NODE_ENV === undefined ||
  process.env.NODE_ENV === 'development' ?
  'http://localhost:3000' : 'http://localhost:3000');

export const MIN_LOADING_TIME = 1000; // Minimum time to show loading indicator

export const MIN_HEADER_HEIGHT = Header.HEIGHT; // Minimum header height (including status bar)
export const MIN_HEADER_HEIGHT_NO_STATUS_BAR = MIN_HEADER_HEIGHT - getStatusBarHeight(true);
export const SEARCH_HEADER_HEIGHT = Header.HEIGHT;

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
