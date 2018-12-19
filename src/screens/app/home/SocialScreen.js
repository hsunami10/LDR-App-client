import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/common/DataList';
import {
  NO_FRIEND_REQUESTS_MSG,
  NO_PENDING_MSG,
  NO_FRIENDS_MSG
} from '../../../constants/noneMessages';
import { getSocialInfo } from '../../../actions/SocialActions';
import { getFriends } from '../../../actions/UserActions';
import { orderToArrData } from '../../../assets/helpers/misc';

// QUESTION: How to organize OWN list of friends?
// NOTE: Don't have to worry about multiple screens for requests - you can only view them on one screen
// QUESTION: Instead of FriendReducer, why not just store all users in UserReducer.all_users = {}?
//   - Could store in all_users with type property ('regular', 'friend', 'pending', 'request')
//
// Going to need multiple lists with different data
// When adding and removing friends, do the same to all (like posting for user profiles)
// Have a FriendReducer, which is like PostReducer - so adding and removing friends will show for all screens
//   - NOTE: ONLY for your OWN friends
// When getting friends, return an order, and an object of user_ids to user objects, like always
//   - Add those object of objects to FriendReducer
//   - Set offset correctly
// In ViewProfileScreen, add object of objects to FriendReducer, but have own offset and order
//
// NOTE: Remember to change ScreenReducer STORE_USER_SCREEN_INFO_SUCCESS to store friends list IF userID = current user
// Have a new action and dispatch - GET_USER_FRIENDS
//
// Remember to also show friend requests - have SectionList if private = true
// Show requests in first section
// Show pending in second section
// Show friends in third section
class SocialScreen extends Component {
  state = { height: 0 }

  componentDidMount() {
    this.props.getSocialInfo(this.props.id, false, '', '', this.props.parentNavigation);
  }

  paginateData = () => {
    const length = this.props.friends.length;
    const lastID = this.props.friends[length - 1].id;
    const lastData = this.props.friends[length - 1].date_friended;
    this.props.getFriends(this.props.id, this.props.id, 'date_friended', 'DESC', lastID, lastData, this.props.parentNavigation);
  }

  handleSocialRefresh = () => this.props.getSocialInfo(this.props.id, true, '', '', this.props.parentNavigation)

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
    return (
      <DataList
        type="users"
        sectionList
        sectionTitles={['Requests', 'Pending', 'Friends']}
        sectionData={[this.props.requests, this.props.pending, this.props.friends]}
        emptyMessages={[NO_FRIEND_REQUESTS_MSG, NO_PENDING_MSG, NO_FRIENDS_MSG]}
        enableRefresh
        refreshing={this.props.refreshing}
        handleRefresh={this.handleSocialRefresh}
        enablePaging
        keepPaging={this.props.keepPaging}
        paginateData={this.paginateData}
        height={this.state.height}
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

SocialScreen.propTypes = {
  id: PropTypes.string.isRequired,
  refreshing: PropTypes.bool.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  getSocialInfo: PropTypes.func.isRequired,
  requests: PropTypes.array.isRequired,
  pending: PropTypes.array.isRequired,
  friends: PropTypes.array.isRequired,
  getFriends: PropTypes.func.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  private: PropTypes.bool
};

const mapStateToProps = state => {
  const requests = orderToArrData(state.social.requests.order, state.social.all_users);
  const pending = orderToArrData(state.social.pending.order, state.social.all_users);
  const friends = orderToArrData(state.social.friends.order, state.social.all_users);
  return {
    id: state.auth.id,
    initial_loading: state.social.initial_loading,
    refreshing: state.social.refreshing,
    keepPaging: state.social.friends.keepPaging,
    requests,
    pending,
    friends,
  };
};

export default connect(mapStateToProps, {
  getSocialInfo,
  getFriends
})(SocialScreen);
