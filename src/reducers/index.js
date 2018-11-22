import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import CommentReducer from './CommentReducer';
import DiscoverReducer from './DiscoverReducer';
import FeedReducer from './FeedReducer';
import LoadingReducer from './LoadingReducer';
import NavigationReducer from './NavigationReducer';
import PostReducer from './PostReducer';
import ScreenReducer from './ScreenReducer';
import TopicReducer from './TopicReducer';
import UserReducer from './UserReducer';

export default combineReducers({
  auth: AuthReducer,
  comments: CommentReducer,
  discover: DiscoverReducer,
  feed: FeedReducer,
  loading: LoadingReducer,
  navigation: NavigationReducer,
  posts: PostReducer,
  screens: ScreenReducer,
  topics: TopicReducer,
  user: UserReducer
});
