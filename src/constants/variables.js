import { Header } from 'react-navigation';

export const ROOT_URL = (
  process.env.NODE_ENV === undefined ||
  process.env.NODE_ENV === 'development' ?
  'http://localhost:3000' : 'http://localhost:3000'); // TODO: Add production URL

export const MIN_LOADING_TIME = 1000; // Minimum time to show loading indicator

export const MIN_HEADER_HEIGHT = Header.HEIGHT; // Minimum header height
