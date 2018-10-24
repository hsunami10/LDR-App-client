import React from 'react';
import { createStackNavigator } from 'react-navigation';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    ViewProfile: props => <ViewProfileScreen {...props} private />, // View own profile
    ViewOtherProfile: ViewProfileScreen // View others' profile
  },
  {
    initialRouteName: 'ViewProfile',
    headerMode: 'none'
  }
);
