import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import CreateReducer from './CreateReducer';
import FeedReducer from './FeedReducer';
import LoadingReducer from './LoadingReducer';
import NavigationReducer from './NavigationReducer';

export default combineReducers({
  auth: AuthReducer,
  create: CreateReducer,
  feed: FeedReducer,
  loading: LoadingReducer,
  navigation: NavigationReducer
});
