import React from 'react';
import shortid from 'shortid';
import { createStackNavigator } from 'react-navigation';
import DiscoverScreen from '../screens/app/social/DiscoverScreen';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';
import ViewPostScreen from '../screens/app/social/ViewPostScreen';

// TODO: Add ViewGroupScreen and other screens if necessary
export default createStackNavigator(
  {
    Discover: DiscoverScreen,
    ViewProfile: props => <ViewProfileScreen {...props} screenID={shortid()} />,
    ViewPost: props => <ViewPostScreen {...props} screenID={shortid()} />
  },
  {
    initialRouteName: 'Discover',
    headerMode: 'none'
  }
);
