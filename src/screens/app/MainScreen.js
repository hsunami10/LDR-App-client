import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, Platform } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import { navigateToRoute, pushTabRoute } from '../../actions/NavigationActions';
import { setNotFirstLogIn } from '../../actions/AuthActions';
import { checkPermission } from '../../assets/helpers/permissions';
import { FullScreenLoading } from '../../components/common';
import HomeStack from '../../navigation/HomeStack';
import DiscoverStack from '../../navigation/DiscoverStack';
import NotificationStack from '../../navigation/NotificationStack';
import ProfileStack from '../../navigation/ProfileStack';

// NOTE: Permissions: camera, photo, location, notification
class MainScreen extends Component {
  state = {
    navigationState: {
      index: 0, // NOTE: If this default index changes, change the "key" in AuthLoadingScreen, replaceCurrentRoute, where it handles android back press events
      // NOTE: If changed, make sure to update AuthLoadingScreen.js in componentDidMount and this componentDidUpdate
      routes: [
        { key: 'home', title: 'Home' },
        { key: 'discover', title: 'Discover' },
        { key: 'compose', title: 'Compose' },
        { key: 'notifications', title: 'Notifications' },
        { key: 'profile', title: 'Profile' }
      ]
    },
    mounted: {
      discover: false,
      notifications: false,
      profile: false
    }
  }

  componentDidMount() {
    // Only check notification permissions when from signing up / logging in screens
    // When this.props.first_login = true
    if (this.props.first_login) {
      checkPermission('notification', this.handleCheckPermission);
    }
  }

  // Handle hardware back button press on android
  componentDidUpdate(prevProps) {
    if (Platform.OS === 'android') {
      // If "going back" - current routes array is smaller than the previous one
      // if (this.props.routes.length < prevProps.routes.length) {
      //   // NOTE: Make sure it's exactly the same as the one in MainScreen.js
      //   // Make sure values correspond with indices in array
      //   // If both are tab routes
      //   if (
      //     this.props.tab_routes[prevProps.current_route] !== undefined &&
      //     this.props.tab_routes[this.props.current_route] !== undefined
      //   ) {
      //     // setState here doesn't trigger infinite updates because
      //     // the length check will not pass a second time
      //     this.setState((prevState) => ({
      //       navigationState: {
      //         ...prevState.navigationState,
      //         index: this.props.tab_routes[this.props.current_route]
      //       }
      //     }));
      //   }
      // }
    }
  }

  handleCheckPermission = (type, response) => {
    if (response === 'undetermined') {
      Permissions.request(type)
        .then(resp => {
          if (resp === 'denied') {
            Alert.alert(
              'Enable Later',
              'If you change your mind, you can always enable push notifications in your settings.',
              [{ text: 'OK', style: 'cancel' }]
            );
          }
        });
    } else if (response === 'denied') {
      Alert.alert(
        'Enable Notifications',
        'Enable push notifications in your settings to receive alerts from this app.',
        [{ text: 'OK', style: 'cancel' }]
      );
    }
    this.props.setNotFirstLogIn(this.props.id);
  }

  handleIndexChange = index => {
    // Don't change scenes if compose tab is clicked
    if (index !== 2 && index !== this.state.navigationState.index) {
      this.setState(prevState => {
        this.props.pushTabRoute(prevState.navigationState.routes[index].key, null);
        return {
          navigationState: { ...prevState.navigationState, index }
        };
      });
    }
  }

  /*
  TODO: Correctly handle tab presses - called before handleIndexChange

  On same tab - check state.navigationState.index value
  On route - check props.current_route

  If props.navigation.current_route === props.navigation.current_tab, then you're at the root of the tab stack

  3 cases to handle for each tab press:
    - if previous tab and current tab are different, then don't do anything - default switch tabs action
    - else if tab and current route are the same, then scroll up
    - else if tab and current route are different, then pop to top of the nested stack navigator (HomeStack, DiscoverStack, NotificationStack, ProfileStack)
   */
  handleTabPress = ({ route }) => {
    switch (route.key) {
      case 'home':
        if (this.props.current_route === 'home') {
          console.log('scroll up home');
        } else if (this.props.current_tab === 'home') {
          console.log('navigate to the top of the home stack');
        }
        break;
      case 'discover':
        if (!this.state.mounted.discover) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, discover: true } }));
        }
        if (this.props.current_route === 'discover') {
          console.log('scroll up discover');
        } else if (this.props.current_tab === 'discover') {
          console.log('navigate to the top of the discover stack');
        }
        break;
      case 'compose':
        this.props.navigateToRoute('Create');
        this.props.navigation.navigate('Create');
        break;
      case 'notifications':
        if (!this.state.mounted.notifications) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, notifications: true } }));
        }
        if (this.props.current_route === 'notifications') {
          console.log('scroll up notifications');
        } else if (this.props.current_tab === 'notifications') {
          console.log('navigate to the top of the notifications stack');
        }
        break;
      case 'profile':
        if (!this.state.mounted.profile) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, profile: true } }));
        }
        if (this.props.current_route === 'profile') {
          console.log('scroll up profile');
        } else if (this.props.current_tab === 'profile') {
          console.log('navigate to the top of the profile stack');
        }
        break;
      default:
        return;
    }
  }

  // screenProps - allow to use parent navigation - this.props.screenProps
  renderScene = ({ route }) => {
    switch (route.key) {
      case 'home':
        return (
          <HomeStack
            screenProps={{
              parentNavigation: this.props.navigation,
              ...this.props.screenProps
            }}
          />
        );
      case 'discover':
        if (this.state.mounted.discover) {
          return (
            <DiscoverStack
              screenProps={{
                parentNavigation: this.props.navigation,
                ...this.props.screenProps
              }}
            />
          );
        }
        break;
      case 'compose':
        break;
      case 'notifications':
        if (this.state.mounted.notifications) {
          return (
            <NotificationStack
              screenProps={{
                parentNavigation: this.props.navigation,
                ...this.props.screenProps
              }}
            />
          );
        }
        break;
      case 'profile':
        if (this.state.mounted.profile) {
          return (
            <ProfileStack
              screenProps={{
                parentNavigation: this.props.navigation,
                ...this.props.screenProps
              }}
            />
          );
        }
        break;
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
          animationEnabled={false}
          onIndexChange={this.handleIndexChange}
          useNativeDriver
        />
        <FullScreenLoading loading={this.props.loading} />
      </View>
    );
  }
}

MainScreen.propTypes = {
  id: PropTypes.string.isRequired,
  setNotFirstLogIn: PropTypes.func.isRequired,
  first_login: PropTypes.bool.isRequired,
  current_route: PropTypes.string.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  pushTabRoute: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  tab_routes: PropTypes.object.isRequired,
  current_tab: PropTypes.string.isRequired,
  screenProps: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  id: state.auth.id,
  first_login: state.auth.first_login,
  current_route: state.navigation.current_route,
  current_tab: state.navigation.current_tab,
  loading: state.loading,
  tab_routes: state.navigation.tab_routes,
});

export default connect(mapStateToProps, {
  navigateToRoute,
  setNotFirstLogIn,
  pushTabRoute
})(MainScreen);
