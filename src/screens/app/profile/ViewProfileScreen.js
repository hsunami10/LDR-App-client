import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, Alert, RefreshControl, Platform } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import { handleError } from '../../../assets/helpers/index';
import { setActive, getUserInfo, setSelectedUser } from '../../../actions/UserActions';
import { logOutUser, removeCredentials } from '../../../actions/AuthActions';
import { navigateToRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';

// NOTE: Remember to handle pagination like FeedScreen, GeneralSearchScreen, DiscoverScreen - FlatList onContentSizeChange, state.canPaginate
// Show user's own profile if: this.props.private OR this.props.selected_user.id === this.props.id

/*
Everytime the user visits a profile screen:
  - Retrieve profile data from database
  - Store in app state
  - Get data from app state and store in local state
  - Remove from app state

QUESTION: What to do if something is edited?
 */
class ViewProfileScreen extends Component {
  state = {
    height: 0,
    prevUser: null,
    targetUser: null,
    flag: false
  }

  componentDidMount() {
    this.handleFirstLoad(false);
  }

  // Only look at local state to determine to re-render
  // Because you do not want it to be affected by other screens
  shouldComponentUpdate(newProps, newState) {
    if (this.state.flag !== newState.flag) {
      return true;
    } else if (this.state.targetUser && newState.targetUser) { // Don't update / re-render if already retrieved user data
      console.log('don\'t update');
      return false;
    }
    return true;
   }

  componentDidUpdate(prevProps) {
    // Must set selected_user to null to stop this from running infinitely
    if (!prevProps.selected_user && this.props.selected_user) {
      console.log('set target user: ', this.props.selected_user);
      this.setState(() => ({ targetUser: this.props.selected_user, prevUser: null }));
      this.props.setSelectedUser(null); // Reset selected user
    }
  }

  componentWillUnmount() {
    this.props.goBackwardTabRoute();
  }

  onPressAction = index => {
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

  rerenderComponent = () => this.setState(prevState => ({ flag: !prevState.flag }))

  handleFirstLoad = refresh => {
    // Mark as null so the component will re-render
    // Save the user so data will still be displayed even when reloading
    this.setState(prevState => ({ targetUser: null, prevUser: prevState.targetUser }));
    const type = this.props.navigation.getParam('type', 'public');
    const targetID = this.props.navigation.getParam('id', this.props.id);
    if (this.props.private || targetID === this.props.id) {
      this.props.getUserInfo(this.props.id, this.props.id, 'private', refresh, undefined, {
        navToApp: () => null,
        navToAuth: this.logOut
      });
    } else {
      // type: 'partner', 'public'
      this.props.getUserInfo(this.props.id, targetID, type, refresh);
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

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  renderBody = () => {
    if (this.state.height === 0) {
      return null;
    } else if (this.props.initial_loading || (!this.state.targetUser && !this.state.prevUser)) {
      return <FullScreenLoading height={this.state.height} loading />;
    }
    return <Text>{this.state.targetUser ? this.state.targetUser.username : this.state.prevUser.username}</Text>;
  }

  renderHeaderTitle = () => {
    const targetID = this.props.navigation.getParam('id', this.props.id);
    if (this.props.private || targetID === this.props.id) {
      return this.props.user.username;
    }
    return this.state.targetUser ? this.state.targetUser.username : this.state.prevUser.username;
  }

  render() {
    console.log('re-render', this.state);
    return (
      <View style={{ flex: 1 }}>
        <StandardHeader
          title={this.renderHeaderTitle()}
          showRight
          headerRight={<Ionicons name={`${Platform.OS}-settings`} size={25} color="gray" />}
          onRightPress={() => this.props.navigation.push('ViewProfile', { type: 'public', id: this.state.targetUser.id })} // TODO: Remove this later - for testing only
          // onRightPress={this.showActionSheet}
          showLeft={!this.props.private} // Show back button only when NOT on the main tab screen profile
          onLeftPress={() => this.props.navigation.pop()}
        />
        <ScrollView
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.props.loading}
              onRefresh={this.handleRefresh}
            />
          }
          onLayout={this.handleLayout}
          scrollEnabled={!this.props.loading}
        >
          {this.renderBody()}
          <ActionSheet
            ref={this.ref}
            options={['Edit Profile', 'Log Out', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
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
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  selected_user: PropTypes.object,
  screenProps: PropTypes.object.isRequired,
  logOutUser: PropTypes.func.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  goBackwardTabRoute: PropTypes.func.isRequired,
  setSelectedUser: PropTypes.func.isRequired
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
  loading: state.user.loading,
  initial_loading: state.user.initial_loading,
  selected_user: state.user.selected_user
});

export default connect(mapStateToProps, {
  getUserInfo,
  logOutUser,
  navigateToRoute,
  goBackwardTabRoute,
  setSelectedUser
})(ViewProfileScreen);
