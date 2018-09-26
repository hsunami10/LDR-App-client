import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import FeedReducer from './FeedReducer';
import LoadingReducer from './LoadingReducer';
import NavigationReducer from './NavigationReducer';

export default combineReducers({
  auth: AuthReducer,
  feed: FeedReducer,
  loading: LoadingReducer,
  navigation: NavigationReducer
});
