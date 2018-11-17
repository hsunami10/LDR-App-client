import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import DiscoverReducer from './DiscoverReducer';
import FeedReducer from './FeedReducer';
import LoadingReducer from './LoadingReducer';
import NavigationReducer from './NavigationReducer';
import ScreenReducer from './ScreenReducer';
import TopicReducer from './TopicReducer';
import UserReducer from './UserReducer';

export default combineReducers({
  auth: AuthReducer,
  discover: DiscoverReducer,
  feed: FeedReducer,
  loading: LoadingReducer,
  navigation: NavigationReducer,
  screens: ScreenReducer,
  topics: TopicReducer,
  user: UserReducer
});
