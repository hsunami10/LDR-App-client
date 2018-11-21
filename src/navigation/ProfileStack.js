import React from 'react';
import shortid from 'shortid';
import { createStackNavigator } from 'react-navigation';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';
import ViewPostScreen from '../screens/app/social/ViewPostScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    ViewProfile: props => <ViewProfileScreen {...props} private screenID={shortid()} />, // View own profile
    ViewOtherProfile: ViewProfileScreen, // View others' profile
    ViewPost: props => <ViewPostScreen {...props} screenID={shortid()} />
  },
  {
    initialRouteName: 'ViewProfile',
    headerMode: 'none'
  }
);
