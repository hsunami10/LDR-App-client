import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, Text, StyleSheet, Alert, RefreshControl, Dimensions } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import { handleError } from '../../../assets/helpers/index';
import { setActive, removeCredentials, getUserInfo } from '../../../actions/AuthActions';
import { popRoute, pushRoute } from '../../../actions/NavigationActions';

class ViewProfileScreen extends Component {
  state = { width: 0, height: 0 }
  componentDidMount() {
    if (!this.props.private) {
      this.props.getUserInfo(this.props.selected_user.id, 'public', false);
    }
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

  handleRefresh = () => {
    if (this.props.private) {
      this.props.getUserInfo(this.props.id, 'private', true, undefined, {
        navToApp: () => null,
        navToAuth: this.logOut
      });
    } else {
      this.props.getUserInfo(this.props.selected_user.id, 'public', true);
    }
  }

  showActionSheet = () => this.ActionSheet.show();
  ref = o => (this.ActionSheet = o)

  logOut = () => {
    removeCredentials()
      .then(() => {
        this.props.popRoute('AuthLoading');
        this.props.pushRoute('Welcome');
        this.props.navigation.navigate('Welcome');
        setActive(this.props.id, false);
      })
      .catch(error => {
        handleError(error);
      });
  }

  handleLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    this.setState(() => ({ width, height }));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StandardHeader
          title="Your Profile"
          showRight
          rightTitle={this.props.private ? 'Settings' : undefined} // TODO: Change to gear icon later
          onRightPress={this.showActionSheet}
        />
        <ScrollView
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.props.user_loading}
              onRefresh={this.handleRefresh}
            />
          }
          onLayout={this.handleLayout}
          scrollEnabled={!this.props.loading}
        >
          <Text>View Profile Screen!</Text>
          <ActionSheet
            ref={this.ref}
            options={['Edit Profile', 'Log Out', 'Cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={this.onPressAction}
          />
          <FullScreenLoading
            width={this.state.width}
            height={this.state.height}
            visible={this.props.loading}
          />
        </ScrollView>
      </View>
    );
  }
}

ViewProfileScreen.propTypes = {
  id: PropTypes.string.isRequired,
  popRoute: PropTypes.func.isRequired,
  pushRoute: PropTypes.func.isRequired,
  private: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  user_loading: PropTypes.bool.isRequired,
  getUserInfo: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  selected_user: PropTypes.object
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
  loading: state.loading,
  user_loading: state.auth.loading,
  user: state.auth.user,
  selected_user: state.auth.selected_user
});

export default connect(mapStateToProps, {
  popRoute,
  pushRoute,
  getUserInfo
})(ViewProfileScreen);
