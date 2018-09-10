export const ROOT_URL = (
  process.env.NODE_ENV === undefined ||
  process.env.NODE_ENV === 'development' ?
  'http://localhost:3000' : 'http://localhost:3000'); // TODO: Add production URL
