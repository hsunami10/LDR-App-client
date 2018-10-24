import { createStackNavigator } from 'react-navigation';
import FeedScreen from '../screens/app/social/FeedScreen';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    Feed: FeedScreen,
    ViewProfile: ViewProfileScreen
  },
  {
    initialRouteName: 'Feed',
    headerMode: 'none'
  }
);
