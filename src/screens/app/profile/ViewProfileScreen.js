import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  RefreshControl,
  Platform,
  Dimensions,
  Animated,
  ImageBackground,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import shortid from 'shortid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import { getUserInfo } from '../../../actions/UserActions';
import { logOutUser } from '../../../actions/AuthActions';
import { navigateToRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';
import { removeUserScreenInfo } from '../../../actions/ScreenActions';
import { logOut } from '../../../assets/helpers/authentication';
import { NO_USER_MSG } from '../../../constants/noneMessages';
import { STATUS_BAR_HEIGHT } from '../../../constants/variables';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const HEADER_HEIGHT = 240;
const COLLAPSED_HEIGHT = 52 + STATUS_BAR_HEIGHT;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;

// NOTE: Use navigation.push('ViewProfile', { id, username }) to view other profiles here
// TODO: Finish this screen
class ViewProfileScreen extends Component {
  state = {
    navigationState: {
      index: 0,
      routes: [
        { key: 'posts', title: 'Posts' },
        { key: 'interactions', title: 'Interactions' },
        { key: 'friends', title: 'Friends' }
      ]
    },
    mounted: {
      interactions: false,
      friends: false
    },

    height: 0,
    screen_id: shortid(),
    user_id: '',
    scroll: new Animated.Value(0)
  }

  componentDidMount() {
    const targetID = this.props.navigation.getParam('id', this.props.id);
    this.setState(() => ({ user_id: targetID }));
    this.handleFirstLoad(false);
  }

  componentWillUnmount() {
    this.props.goBackwardTabRoute();
    this.props.removeUserScreenInfo(this.state.user_id, this.state.screen_id);
  }

  onPressAction = index => {
    if (this.state.user_id === this.props.id) {
      this.handleOwnActions(index);
    } else {
      this.handleOtherActions(index);
    }
  }

  hasNoContentShowing = () => (
    this.props.profiles[this.state.user_id] === undefined ||
    this.props.profiles[this.state.user_id][this.state.screen_id] === undefined ||
    this.props.profiles[this.state.user_id][this.state.screen_id].initial_loading ||
    Object.keys(this.props.profiles[this.state.user_id][this.state.screen_id]).length === 0
  );

  handleOwnActions = index => {
    switch (index) {
      case 0:
        console.log('edit profile');
        break;
      case 1:
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', onPress: this.logOutUser }
          ]
        );
        break;
      default:
        return;
    }
  }

  handleOtherActions = index => {
    switch (index) {
      case 0:
        console.log('block user');
        break;
      default:
        return;
    }
  }

  // For some reason, this.props.screenID changes 3 times
  handleFirstLoad = refresh => {
    const targetID = this.props.navigation.getParam('id', this.props.id);
    if (targetID === this.props.id) {
      this.props.getUserInfo(
        this.props.id,
        this.props.id,
        refresh,
        this.state.screen_id,
        'posts', // TODO: Add current tab here
        'date_posted', // TODO: Have all of this work with real data
        'DESC', // TODO: Have all of this work with real data
        '', // TODO: Have all of this work with real data
        '', // TODO: Have all of this work with real data
        this.props.screenProps.parentNavigation
      );
    } else {
      this.props.getUserInfo(
        this.props.id,
        targetID,
        refresh,
        this.state.screen_id,
        'posts', // TODO: Add current tab here
        'date_posted', // TODO: Have all of this work with real data
        'DESC', // TODO: Have all of this work with real data
        '', // TODO: Have all of this work with real data
        '', // TODO: Have all of this work with real data
        this.props.screenProps.parentNavigation
      );
    }
  }

  handleNoUserError = () => this.props.navigation.pop()
  handleRefresh = () => this.handleFirstLoad(true)
  showActionSheet = () => this.ActionSheet.show();
  ref = o => (this.ActionSheet = o)
  logOutUser = () => this.props.logOut(this.props.screenProps.parentNavigation)

  handleIndexChange = index => {
    if (index !== this.state.navigationState.index) {
      this.setState(prevState => {
        let mounted = { ...prevState.mounted };
        switch (index) {
          case 1:
            if (!prevState.mounted.interactions) {
              mounted = {
                ...prevState.mounted,
                interactions: true
              };
            }
            break;
          case 2:
            if (!prevState.mounted.friends) {
              mounted = {
                ...prevState.mounted,
                friends: true
              };
            }
            break;
          default:
            break;
        }
        return {
          navigationState: {
            ...prevState.navigationState,
            index
          },
          mounted
        };
      });
    }
  }

  // Only allow refresh if not initial loading
  handleRefreshControl = () => {
    if ( // NOTE: Same as renderBody if statement
      this.props.profiles[this.state.user_id] === undefined ||
      this.props.profiles[this.state.user_id][this.state.screen_id] === undefined ||
      this.props.profiles[this.state.user_id][this.state.screen_id].initial_loading
    ) {
      return null;
    }
    return (
      <RefreshControl
        refreshing={this.props.profiles[this.state.user_id][this.state.screen_id].refreshing}
        onRefresh={this.handleRefresh}
      />
    );
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  renderTabBar = props => {
    const translateY = this.state.scroll.interpolate({
      inputRange: [0, SCROLLABLE_HEIGHT],
      outputRange: [0, -SCROLLABLE_HEIGHT],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
        <ImageBackground
          source={{ uri: 'https://picsum.photos/900' }}
          style={styles.cover}
        >
          <View style={styles.overlay} />
          <TabBar {...props} style={styles.tabbar} useNativeDriver />
        </ImageBackground>
      </Animated.View>
    );
  };

  renderHeaderTitle = () => {
    const targetID = this.props.navigation.getParam('id', this.props.id);
    if (targetID === this.props.id) {
      return this.props.user.username;
    }
    return this.props.navigation.getParam('username', '');
  }

  renderScene = ({ route }) => (
    <ScrollView
      scrollEventThrottle={16}
      refreshControl={this.handleRefreshControl()}
      onLayout={this.handleLayout}
      scrollEnabled={!this.hasNoContentShowing()}
      onScroll={() => Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
          { useNativeDriver: true }
      )}
    >
      {this.renderBody(route)}
    </ScrollView>
  );

  renderBody = route => {
    if (this.state.height === 0) {
      return null;
    } else if ( // NOTE: Same as handleRefreshControl if statement
      this.props.profiles[this.state.user_id] === undefined ||
      this.props.profiles[this.state.user_id][this.state.screen_id] === undefined ||
      this.props.profiles[this.state.user_id][this.state.screen_id].initial_loading
    ) {
      return <FullScreenLoading height={this.state.height} loading />;
    } else if (Object.keys(this.props.profiles[this.state.user_id][this.state.screen_id]).length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: this.state.height }}>
          <Text>
            {NO_USER_MSG}
          </Text>
        </View>
      );
    }
    return this.renderContent(route);
  }

  // TODO: Display actual content here
  renderContent = route => {
    switch (route.key) {
      case 'posts':
        return (
          <Text>Posts List!</Text>
        );
      case 'interactions':
        if (this.state.mounted.interactions) {
          return (
            <Text>Interactions List!</Text>
          );
        }
        break;
      case 'friends':
        if (this.state.mounted.friends) {
          return (
            <Text>Friends List!</Text>
          );
        }
        break;
      default:
        return null;
    }
    return null;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StandardHeader
          title={this.renderHeaderTitle()}
          showRight
          disableRight={this.hasNoContentShowing()}
          headerRight={<Ionicons name={`${Platform.OS}-settings`} size={25} color="gray" />}
          onRightPress={this.showActionSheet}
          // Show back button only when NOT on the main tab screen profile
          showLeft={this.props.current_route !== 'profile'}
          onLeftPress={() => this.props.navigation.pop()}
        />
        <View
          style={{ flex: 1 }}
          onLayout={this.handleLayout}
        >
          <TabView
            style={{ flex: 1 }}
            tabBarPosition="top"
            navigationState={this.state.navigationState}
            renderScene={this.renderScene}
            renderTabBar={this.renderTabBar}
            onIndexChange={this.handleIndexChange}
            initialLayout={initialLayout}
            useNativeDriver
          />
          <ActionSheet
            ref={this.ref}
            options={this.state.user_id === this.props.id ? ['Edit Profile', 'Log Out', 'Cancel'] : ['Block', 'Report', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={this.state.user_id === this.props.id ? 1 : undefined}
            onPress={this.onPressAction}
          />
        </View>
      </View>
    );
  }
}

ViewProfileScreen.propTypes = {
  id: PropTypes.string.isRequired,
  private: PropTypes.bool,
  user: PropTypes.object.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  screenProps: PropTypes.object.isRequired,
  logOutUser: PropTypes.func.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  goBackwardTabRoute: PropTypes.func.isRequired,
  removeUserScreenInfo: PropTypes.func.isRequired,
  profiles: PropTypes.object.isRequired,
  current_route: PropTypes.string.isRequired,
  logOut: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1
  },
  leftStyle: {
    color: '#007aff',
    fontSize: 16
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .32)',
  },
  cover: {
    height: HEADER_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  tabbar: {
    backgroundColor: 'rgba(0, 0, 0, .32)',
    elevation: 0,
    shadowOpacity: 0,
  },
});

const mapStateToProps = state => ({
  id: state.auth.id,
  user: state.user,
  profiles: state.screens.profiles,
  current_route: state.navigation.current_route
});

export default connect(mapStateToProps, {
  getUserInfo,
  logOutUser,
  navigateToRoute,
  goBackwardTabRoute,
  removeUserScreenInfo,
  logOut
})(ViewProfileScreen);
