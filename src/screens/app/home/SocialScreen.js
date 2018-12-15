import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import { FullScreenLoading } from '../../../components/common';
import DataList from '../../../components/DataList';
import { NO_FRIENDS_MSG } from '../../../constants/noneMessages';
import { getSocialInfo } from '../../../actions/SocialActions';

const requests = [
  {
    id: 'fdjaoifdjsaflkadsf',
    username: 'Request 123',
    profile_pic: null,
    message: 'Let\'s be friends!',
    type: 'request'
  },
  {
    id: 'sdfdfflsakfjdsaf',
    username: 'UserRequest222',
    profile_pic: null,
    date_joined: '1544212302',
    type: 'request'
  },
  {
    id: 'dmasdfdfflsakfjdsaf',
    username: 'User100000',
    profile_pic: null,
    date_joined: '1544232932',
    type: 'request'
  },
  {
    id: 'dfjdsaf',
    username: 'Noob',
    profile_pic: null,
    date_joined: '1544129401',
    type: 'request'
  }
];

const pending = [
  {
    id: 'asdjflksdfdsafd',
    username: 'PendingUser111',
    profile_pic: null,
    date_joined: '1544231022',
    type: 'pending'
  },
  {
    id: 'asdfjasdlkfjalsdf',
    username: 'PendingUser2002',
    profile_pic: null,
    date_joined: '1544111111',
    type: 'pending'
  }
];

// TODO: Change to object of objects, and array of user_ids (order)
const friends = [
  {
    id: 'asldkfadslkfsdf',
    username: 'Noob User 123',
    profile_pic: null,
    date_joined: '1544237986',
    message: 'Let\'s be friends!',
    type: 'request'
  },
  {
    id: 'dsfdfadsfdsf',
    username: 'HelloWorld',
    profile_pic: null,
    date_joined: '1544233000',
    date_friended: '1544233000',
    type: 'friend'
  },
  {
    id: 'fsdfdadfasdf',
    username: 'I AM DUMB',
    profile_pic: null,
    date_joined: '1544237100',
    type: 'regular'
  },
  {
    id: 'ukyftjfjfytj',
    username: 'Noob User 8888888',
    profile_pic: null,
    date_joined: '1544220000',
    date_sent: '1544220000',
    type: 'pending'
  },
  {
    id: 'asdfoiasdfjajcsalkdf',
    username: 'throwawayUser10',
    profile_pic: null,
    date_joined: '1544220382',
    date_friended: '1544220382',
    type: 'friend'
  },
  {
    id: 'lkjlkfjdskjfsdf',
    username: 'I am a nice Friend',
    profile_pic: null,
    date_joined: '1544220011',
    date_friended: '1544220011',
    type: 'friend'
  }
];

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
// Remember to also show friend requests - have SectionList if showFriendRequests = true
// Show requests in first section
// Show pending in second section
// Show friends in third section
class SocialScreen extends Component {
  state = { height: 0 }

  componentDidMount() {
    this.props.getSocialInfo(this.props.id, false, 0, this.props.parentNavigation);
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  renderBody = () => {
    if (this.state.height === 0) { // Get rid of small jump in spinning icon
      return null;
    } else if (this.props.initial_loading) { // Only true once, on componentDidMount
      return <FullScreenLoading height={this.state.height} loading />;
    } /*else if (this.props.showFriendRequests) { // TODO: Show sectioned list
      return (
        <View>
          <Text>Show SectionList with Requests, Pending, Friends, Here. Always pull ALL requests and ALL pending, but only page 20 friends at a time. Do not allow any sorting.</Text>
        </View>
      );
    }*/
    // TODO: Finish this later
    // Can allow sorting here
    return (
      <DataList
        type="users"
        flatList
        data={friends}
        empty={friends.length === 0}
        // data={this.props.friends}
        // empty={this.props.friends.length === 0}
        message={NO_FRIENDS_MSG}
        onItemSelect={item => console.log('item selected: ', item)}
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
  users: PropTypes.array.isRequired,
  refreshing: PropTypes.bool.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  getSocialInfo: PropTypes.func.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  showFriendRequests: PropTypes.bool
};

const mapStateToProps = state => ({
  id: state.auth.id,
  initial_loading: state.social.initial_loading,
  refreshing: state.social.refreshing,
  keepPaging: state.social.keepPaging
});

export default connect(mapStateToProps, {
  getSocialInfo
})(SocialScreen);
