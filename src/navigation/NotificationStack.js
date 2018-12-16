import { createStackNavigator } from 'react-navigation';
import NotificationScreen from '../screens/app/NotificationScreen';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';
import ViewPostScreen from '../screens/app/post/ViewPostScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    Notification: NotificationScreen,
    ViewProfile: ViewProfileScreen,
    ViewPost: ViewPostScreen
  },
  {
    initialRouteName: 'Notification',
    headerMode: 'none'
  }
);
