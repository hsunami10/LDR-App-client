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

export const MAX_POST_BODY_LINES = 5;

export const MAX_TEXT_INPUT_LINES = 5;
export const MIN_TEXT_INPUT_VIEW_HEIGHT = 30;

export const VIEW_MORE_TEXT = 'See More';
export const VIEW_LESS_TEXT = 'Show Less';

export const MIN_HEADER_HEIGHT = Header.HEIGHT; // Minimum header height (including status bar)
export const MIN_HEADER_HEIGHT_NO_STATUS_BAR = MIN_HEADER_HEIGHT - getStatusBarHeight(true);
export const SEARCH_HEADER_HEIGHT = Header.HEIGHT;
export const STATUS_BAR_HEIGHT = getStatusBarHeight(true);

export const COMMENTS_PAGINATE_LIMIT = 5; // NOTE: Same as commentsLimit in server/helpers/paginate.js

export const DEFAULT_IOS_BACKGROUND_COLOR = '#E9E9EF';
export const DEFAULT_ANDROID_BACKGROUND_COLOR = 'white';

// NOTE: "default" has to match one of the other keys
// NOTE: Has to match server/assets/constants.js file
// posts, users, topics - have to match "type" for DataList
export const ListOrders = Object.freeze({
  posts: {
    default: { // Default = new
      text: 'Newest',
      order: 'date_posted',
      direction: 'DESC'
    },
    new: {
      text: 'Newest',
      order: 'date_posted',
      direction: 'DESC'
    },
    popular: {
      text: 'Most Popular',
      order: 'num_likes',
      direction: 'DESC'
    }
  },
  users: {
    default: { // Default = new
      text: 'Recently Joined',
      order: 'date_joined',
      direction: 'DESC'
    },
    new: {
      text: 'Recently Joined',
      order: 'date_joined',
      direction: 'DESC'
    },
    popular: {
      text: 'Most Popular',
      order: 'num_friends',
      direction: 'DESC'
    },
    alpha: {
      text: 'Alphabetical',
      order: 'lowercase_username',
      direction: 'ASC'
    }
  },
  topics: {
    default: { // Default = popular
      text: 'Most Popular',
      order: 'num_subscribers',
      direction: 'DESC'
    },
    popular: {
      text: 'Most Popular',
      order: 'num_subscribers',
      direction: 'DESC'
    },
    new: {
      text: 'Recently Created',
      order: 'date_created',
      direction: 'DESC'
    }
  }
});

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
