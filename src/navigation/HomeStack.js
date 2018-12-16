import { createStackNavigator } from 'react-navigation';
import HomeScreen from '../screens/app/home/HomeScreen';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';
import ViewPostScreen from '../screens/app/post/ViewPostScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
// TODO: Change initialRouteName to 'Home', route to Home, have as tab view with 3 tabs
export default createStackNavigator(
  {
    Home: HomeScreen,
    ViewProfile: ViewProfileScreen,
    ViewPost: ViewPostScreen
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
);
