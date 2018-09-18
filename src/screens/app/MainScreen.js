import React, { Component } from 'react';
import { View } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import FeedScreen from './social/FeedScreen';
import DiscoverScreen from './social/DiscoverScreen';
import ViewProfileScreen from './profile/ViewProfileScreen';
import SettingsScreen from './settings/SettingsScreen';

class MainScreen extends Component {
  state = {
    navigationState: {
      index: 0,
      routes: [
        { key: 'feed', title: 'Feed' },
        { key: 'discover', title: 'Discover' },
        { key: 'compose', title: 'Compose' },
        { key: 'profile', title: 'Profile' },
        { key: 'settings', title: 'Settings' }
      ]
    }
  }

  handleIndexChange = index => {
    // Don't change scenes if compose tab is clicked
    if (index !== 2) {
      this.setState((prevState) => ({
        navigationState: { ...prevState.navigationState, index }
      }));
    }
  }

  handleTabPress = ({ route }) => {
    switch (route.key) {
      case 'feed':
        console.log('scroll up feed');
        break;
      case 'discover':
        console.log('scroll up discover');
        break;
      case 'compose':
        console.log('open compose view');
        break;
      case 'profile':
        console.log('scroll up profile');
        break;
      case 'settings':
        console.log('scroll up settings');
        break;
      default:
        return;
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'feed':
        return <FeedScreen navigation={this.props.navigation} />;
      case 'discover':
        return <DiscoverScreen navigation={this.props.navigation} />;
      case 'compose':
        break;
      case 'profile':
        return <ViewProfileScreen type="private" navigation={this.props.navigation} />;
      case 'settings':
        return <SettingsScreen navigation={this.props.navigation} />;
      default:
        return;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabView
          tabBarPosition="bottom"
          navigationState={this.state.navigationState}
          renderScene={this.renderScene}
          renderTabBar={props =>
            <TabBar
              {...props}
              useNativeDriver
              onTabPress={this.handleTabPress}
              // indicatorStyle={{ borderBottomColor: 'pink', borderBottomWidth: 2 }}
            />
          }
          swipeEnabled={false}
          // animationEnabled={false}
          onIndexChange={this.handleIndexChange}
          useNativeDriver
        />
      </View>
    );
  }
}

export default MainScreen;
