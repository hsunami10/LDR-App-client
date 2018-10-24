import { createStackNavigator } from 'react-navigation';
import NotificationScreen from '../screens/app/NotificationScreen';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    Notification: NotificationScreen,
    ViewProfile: ViewProfileScreen
  },
  {
    initialRouteName: 'Notification',
    headerMode: 'none'
  }
);
