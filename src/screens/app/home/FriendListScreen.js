import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { FullScreenLoading } from '../../../components/common';
import UserList from '../../../components/user/UserList';
import { NO_FRIENDS_MSG } from '../../../constants/noneMessages';

const requests = [
  [
    {
      id: 'fdjaoifdjsaflkadsf',
      username: 'Request 123',
      date_joined: '1544238461'
    }
  ]
];

const users = [
  {
    id: 'asldkfadslkfsdf',
    username: 'Noob User 123',
    date_joined: '1544237986',
    isFriend: true
  }
];

// QUESTION: How to organize list of friends?
// Going to need multiple lists with different data
// When adding and removing friends, do the same to all (like posting for user profiles)
// Have a FriendReducer, which is like PostReducer - so adding and removing friends will show for all screens
// When getting friends, return an order, and an object of user_ids to user objects, like always
// NOTE: Remember to change ScreenReducer STORE_USER_SCREEN_INFO to store friends list IF userID = current user
// Have a new action and dispatch - GET_USER_FRIENDS
//
// Remember to also show friend requests - have SectionList if showFriendRequests = true
// Show UserRequestCard in first section
// Show UserCard in second section
class FriendListScreen extends Component {
  state = { height: 0 }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  renderBody = () => {
    if (this.state.height === 0) { // Get rid of small jump in spinning icon
      return null;
    } else if (this.props.initial_loading) { // Only true once, on componentDidMount
      return <FullScreenLoading height={this.state.height} loading />;
    }
    // Only updates root components (PostCard), so remember to force re-render nested components by changing state
    return (
      <UserList
        data={this.props.users}
        // empty={this.props.users.length === 0}
        empty
        message={NO_FRIENDS_MSG}
        height={this.state.height}
        allowSorting
        sortPosts={this.handleSortPosts}
        refreshing={this.props.loading}
        handleRefresh={this.handleRefresh}
        paginateData={this.paginateData}
        keepPaging={this.props.keepPaging}
        navigation={this.props.navigation}
        parentNavigation={this.props.parentNavigation}
      />
    );
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        onLayout={this.handleLayout}
      >
        {this.renderBody()}
      </View>
    );
  }
}

FriendListScreen.propTypes = {
  id: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  showFriendRequests: PropTypes.bool
};

const mapStateToProps = state => ({
  id: state.auth.id
});

export default connect(mapStateToProps, null)(FriendListScreen);
