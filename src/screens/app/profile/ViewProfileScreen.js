import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, Alert, RefreshControl, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import shortid from 'shortid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import { handleError } from '../../../assets/helpers/errors';
import { getUserInfo } from '../../../actions/UserActions';
import { logOutUser, removeCredentials } from '../../../actions/AuthActions';
import { navigateToRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';
import { removeUserScreenInfo } from '../../../actions/ScreenActions';
import { logOut } from '../../../assets/helpers/authentication';

// NOTE: Remember to handle pagination like FeedScreen, GeneralSearchScreen, DiscoverScreen - FlatList onContentSizeChange, state.canPaginate
// NOTE: Use navigation.push('ViewOtherProfile', { id, screenID }) to view other profiles here
// Navigate to ViewOtherProfile if user ID != your ID
// Navigate to ViewProfile if user ID == your ID
/*
2 types of loading:
  - on mount, initial_loading
  - refreshing
Other types are handled by subtabs

// TODO: Figure out how to lazy load
NOTE: ONE SCROLLVIEW - no need for nested ScrollView
 */
class ViewProfileScreen extends Component {
  state = {
    height: 0,
    screen_id: shortid(),
    user_id: ''
  }

  componentDidMount() {
    const targetID = this.props.navigation.getParam('id', this.props.id);
    this.setState(() => ({ user_id: targetID }));
    this.handleFirstLoad(false);
  }

  componentWillUnmount() {
    this.props.goBackwardTabRoute();
    if (this.props.current_route !== 'Welcome') { // Only true if logging out
      this.props.removeUserScreenInfo(this.state.user_id, this.state.screen_id);
    }
  }

  onPressAction = index => {
    if (this.state.user_id === this.props.id) {
      this.handleOwnActions(index);
    } else {
      this.handleOtherActions(index);
    }
  }

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
            { text: 'Log Out', onPress: this.logOut }
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
    const type = this.props.navigation.getParam('type', 'public');
    const targetID = this.props.navigation.getParam('id', this.props.id);
    if (this.props.private || targetID === this.props.id) {
      this.props.getUserInfo(this.props.id, this.props.id, 'private', refresh, undefined, {
        navToApp: () => null,
        navToAuth: this.logOut
      }, this.state.screen_id);
    } else {
      // type: 'partner', 'public'
      this.props.getUserInfo(this.props.id, targetID, type, refresh, this.state.screen_id);
    }
  }

  handleRefresh = () => this.handleFirstLoad(true)
  showActionSheet = () => this.ActionSheet.show();
  ref = o => (this.ActionSheet = o)
  logOutUser = () => this.props.logOut(this.props.screenProps.parentNavigation)

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

  renderBody = () => {
    if (this.state.height === 0) {
      return null;
    } else if ( // NOTE: Same as handleRefreshControl if statement
      this.props.profiles[this.state.user_id] === undefined ||
      this.props.profiles[this.state.user_id][this.state.screen_id] === undefined ||
      this.props.profiles[this.state.user_id][this.state.screen_id].initial_loading
    ) {
      return <FullScreenLoading height={this.state.height} loading />;
    }
    // TODO: Display actual information here
    return this.renderContent();
  }

  renderHeaderTitle = () => {
    const targetID = this.props.navigation.getParam('id', this.props.id);
    if (this.props.private || targetID === this.props.id) {
      return this.props.user.username;
    }
    return this.props.navigation.getParam('username', '');
  }

  renderContent = () => (
    <Text>{JSON.stringify(this.props.profiles[this.state.user_id][this.state.screen_id])}</Text>
  )

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StandardHeader
          title={this.renderHeaderTitle()}
          showRight
          headerRight={<Ionicons name={`${Platform.OS}-settings`} size={25} color="gray" />}
          onRightPress={this.showActionSheet}
          showLeft={!this.props.private} // Show back button only when NOT on the main tab screen profile
          onLeftPress={() => this.props.navigation.pop()}
        />
        <ScrollView
          scrollEventThrottle={16}
          refreshControl={this.handleRefreshControl()}
          onLayout={this.handleLayout}
        >
          {this.renderBody()}
          <ActionSheet
            ref={this.ref}
            options={this.state.user_id === this.props.id ? ['Edit Profile', 'Log Out', 'Cancel'] : ['Block', 'Report', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={this.state.user_id === this.props.id ? 1 : undefined}
            onPress={this.onPressAction}
          />
        </ScrollView>
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
  logOut: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1
  },
  leftStyle: {
    color: '#007aff',
    fontSize: 16
  }
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
