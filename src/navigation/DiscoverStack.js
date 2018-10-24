import { createStackNavigator } from 'react-navigation';
import DiscoverScreen from '../screens/app/social/DiscoverScreen';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    Discover: DiscoverScreen,
    ViewProfile: ViewProfileScreen
  },
  {
    initialRouteName: 'Discover',
    headerMode: 'none'
  }
);
