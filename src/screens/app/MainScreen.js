import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Alert, Platform } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import { pushRoute } from '../../actions/NavigationActions';
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
    this.props.pushRoute('feed'); // FeedScreen is the default screen
  }

  componentDidUpdate(prevProps) {
    if (Platform.OS === 'android') {
      // If "going back" - current routes array is smaller than the previous one
      if (this.props.routes.length < prevProps.routes.length) {
        // NOTE: Make sure it's exactly the same as the one in MainScreen.js
        // Make sure values correspond with indices in array
        // If both are tab routes
        const mainScreenTabKeys = { feed: 0, discover: 1, notifications: 3, profile: 4 };
        if (
          mainScreenTabKeys[prevProps.current_route] !== undefined &&
          mainScreenTabKeys[this.props.current_route] !== undefined
        ) {
          // setState here doesn't trigger infinite updates because
          // the length check will not pass a second time
          this.setState((prevState) => ({
            navigationState: {
              ...prevState.navigationState,
              index: mainScreenTabKeys[this.props.current_route]
            }
          }));
        }
      }
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
    if (index !== 2) {
      this.setState((prevState) => {
        this.props.pushRoute(prevState.navigationState.routes[index].key);
        return {
          navigationState: { ...prevState.navigationState, index }
        };
      });
    }
  }

  // TODO: Handle scrolling up - check routes to see if it's on the same route
  // If on a subroute, then navigate back to the parent tab (like reddit)
  handleTabPress = ({ route }) => {
    switch (route.key) {
      case 'feed':
        if (this.props.current_route === 'feed') {
          console.log('scroll up feed');
        }
        break;
      case 'discover':
        if (!this.state.mounted.discover) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, discover: true } }));
        }
        if (this.props.current_route === 'discover') {
          console.log('scroll up discover');
        }
        break;
      case 'compose':
        if (this.props.alias_fetched) {
          this.props.pushRoute('Create');
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
  pushRoute: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  alias_fetched: PropTypes.bool.isRequired,
  fetchAliases: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  alias_fetched: state.user.alias_fetched, // Check if aliases have already been fetched
  first_login: state.auth.first_login,
  current_route: state.navigation.current_route,
  routes: state.navigation.routes,
  loading: state.loading
});

export default connect(mapStateToProps, {
  pushRoute,
  setNotFirstLogIn,
  fetchAliases
})(MainScreen);
