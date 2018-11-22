import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, Alert, RefreshControl, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import shortid from 'shortid';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import { handleError } from '../../../assets/helpers/index';
import { setActive, getUserInfo } from '../../../actions/UserActions';
import { logOutUser, removeCredentials } from '../../../actions/AuthActions';
import { navigateToRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';
import { removeUserScreenInfo } from '../../../actions/ScreenActions';

// NOTE: Remember to handle pagination like FeedScreen, GeneralSearchScreen, DiscoverScreen - FlatList onContentSizeChange, state.canPaginate
// NOTE: Use navigation.push('ViewOtherProfile', { id, screenID }) to view other profiles here
// Navigate to ViewOtherProfile if user ID != your ID
// Navigate to ViewProfile if user ID == your ID
/*
2 types of loading:
  - on mount, initial_loading
  - refreshing
Other types are handled by subtabs
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
    this.props.removeUserScreenInfo(this.state.user_id, this.state.screen_id);
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

  logOut = () => {
    removeCredentials()
      .then(() => {
        this.props.logOutUser();
        this.props.navigateToRoute('Welcome');
        this.props.screenProps.parentNavigation.navigate('Welcome');
        setActive(this.props.id, false);
      })
      .catch(error => {
        handleError(new Error(`Unable to access keychain. ${error.message}`), false);
      });
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
    return <Text>{JSON.stringify(this.props.profiles[this.state.user_id][this.state.screen_id])}</Text>;
  }

  renderHeaderTitle = () => {
    const targetID = this.props.navigation.getParam('id', this.props.id);
    if (this.props.private || targetID === this.props.id) {
      return this.props.user.username;
    } else if (this.props.profiles[this.state.user_id] && this.props.profiles[this.state.user_id][this.state.screen_id]) {
      return this.props.profiles[this.state.user_id][this.state.screen_id].username;
    }
    return '';
  }

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
  profiles: PropTypes.object.isRequired
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
});

export default connect(mapStateToProps, {
  getUserInfo,
  logOutUser,
  navigateToRoute,
  goBackwardTabRoute,
  removeUserScreenInfo
})(ViewProfileScreen);
