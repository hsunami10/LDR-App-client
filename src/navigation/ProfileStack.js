import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';
import ViewPostScreen from '../screens/app/social/ViewPostScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    ViewProfile: props => <ViewProfileScreen {...props} private />,
    ViewOtherProfile: ViewProfileScreen,
    ViewPost: ViewPostScreen
  },
  {
    initialRouteName: 'ViewProfile',
    headerMode: 'none'
  }
);
