import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, Platform } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import { navigateToRoute, pushTabRoute } from '../../actions/NavigationActions';
import { setNotFirstLogIn } from '../../actions/AuthActions';
import { fetchAliases } from '../../actions/UserActions';
import { checkPermission } from '../../assets/helpers';
import { FullScreenLoading } from '../../components/common';
import FeedStack from '../../navigation/FeedStack';
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
        { key: 'feed', title: 'Feed' },
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
      //     this.props.tab_indices[prevProps.current_route] !== undefined &&
      //     this.props.tab_indices[this.props.current_route] !== undefined
      //   ) {
      //     // setState here doesn't trigger infinite updates because
      //     // the length check will not pass a second time
      //     this.setState((prevState) => ({
      //       navigationState: {
      //         ...prevState.navigationState,
      //         index: this.props.tab_indices[this.props.current_route]
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
    if (index !== 2 && index !== this.state.index) {
      this.setState((prevState) => {
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
    - else if tab and current route are different, then pop to top of the nested stack navigator (FeedStack, DiscoverStack, NotificationStack, ProfileStack)
   */
  handleTabPress = ({ route }) => {
    switch (route.key) {
      case 'feed':
        if (this.props.current_route === 'feed') {
          console.log('scroll up feed');
        } else if (this.props.current_tab === 'feed') {
          console.log('navigate to the top of the feed stack');
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
        if (this.props.alias_fetched) {
          this.props.navigateToRoute('Create');
          this.props.navigation.navigate('Create');
        } else {
          this.props.fetchAliases(this.props.id, this.props.navigation);
        }
        break;
      case 'notifications':
        if (!this.state.mounted.notifications) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, notifications: true } }));
        }
        if (this.props.current_route === 'notifications') {
          console.log('scroll up notifications');
        }
        break;
      case 'profile':
        if (!this.state.mounted.profile) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, profile: true } }));
        }
        if (this.props.current_route === 'profile') {
          console.log('scroll up profile');
        }
        break;
      default:
        return;
    }
  }

  // screenProps - allow to use parent navigation - this.props.screenProps
  renderScene = ({ route }) => {
    switch (route.key) {
      case 'feed':
        return <FeedStack screenProps={{ parentNavigation: this.props.navigation }} />;
      case 'discover':
        if (this.state.mounted.discover) {
          return <DiscoverStack screenProps={{ parentNavigation: this.props.navigation }} />;
        }
        break;
      case 'compose':
        break;
      case 'notifications':
        if (this.state.mounted.notifications) {
          return <NotificationStack screenProps={{ parentNavigation: this.props.navigation }} />;
        }
        break;
      case 'profile':
        if (this.state.mounted.profile) {
          return <ProfileStack screenProps={{ parentNavigation: this.props.navigation }} />;
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
  routes: PropTypes.array.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  pushTabRoute: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  alias_fetched: PropTypes.bool.isRequired,
  fetchAliases: PropTypes.func.isRequired,
  tab_indices: PropTypes.object.isRequired,
  current_tab: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  alias_fetched: state.user.alias_fetched, // Check if aliases have already been fetched
  first_login: state.auth.first_login,
  current_route: state.navigation.current_route,
  current_tab: state.navigation.current_tab,
  routes: state.navigation.routes,
  loading: state.loading,
  tab_indices: state.navigation.tab_indices
});

export default connect(mapStateToProps, {
  navigateToRoute,
  setNotFirstLogIn,
  fetchAliases,
  pushTabRoute
})(MainScreen);
