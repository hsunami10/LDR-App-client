import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import shortid from 'shortid';
import { StandardHeader } from '../../../components/common';
import PostCard from '../../../components/post/PostCard';
import { pushTabRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';
import { removePostScreenInfo } from '../../../actions/ScreenActions';
import { getPostComments } from '../../../actions/PostActions';

// TODO: componentDidMount / reload, store in app state screens - like ViewProfileScreen
// 3 types of loading:
//  - on mount, initial_loading for comments, get /api/posts/comments/, offset = 0
//  - on refresh, update post and comments, get /api/posts/
//  - view previous comments, get /api/posts/comments/, offset > 0
// If no comments, then show "no comments" message and DO NOT allow "view previous comments"
// Hide "view previous comments" if number of comments fetched is < limit (5)
class ViewPostScreen extends Component {
  state = {
    height: 0,
    screen_id: '',
    post_id: ''
  }

  componentDidMount() {
    this.handleFirstLoad(false);
  }

  componentWillUnmount() {
    this.props.goBackwardTabRoute();
    this.props.removePostScreenInfo(this.state.post_id, this.state.screen_id);
  }

  viewProfile = id => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id,
      screenID: shortid()
    });
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  handleFirstLoad = refresh => {
    const post = this.props.navigation.getParam('post', null);
    const screenID = this.props.navigation.getParam('screenID', null);
    this.setState(() => ({
      post_id: post.id,
      screen_id: screenID
    }));
    // TODO: Implement this function later
    if (!refresh) {
      this.props.getPostComments(post, screenID);
    } else {
      // TODO: get /api/posts/
      console.log('get post and comments');
    }
  }

  handleLeftPress = () => this.props.navigation.pop()

  renderBody = () => {
    return (
      <View style={{ flex: 1 }}>
        <PostCard
          userID={this.props.id}
          post={this.props.navigation.getParam('post', {})}
          viewProfile={this.viewProfile}
          postLikes={this.props.post_likes}
          navigation={this.props.navigation}
          parentNavigation={this.props.screenProps.parentNavigation}
          viewing
        />
        <Text>{this.props.none_msg}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.centerItems}>
        <StandardHeader
          title="Post"
          showLeft
          onLeftPress={this.handleLeftPress}
        />
        <ScrollView
          scrollEventThrottle={16}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={this.props.loading}
          //     onRefresh={this.handleRefresh}
          //   />
          // }
          onLayout={this.handleLayout}
        >
          {this.renderBody()}
        </ScrollView>
      </View>
    );
  }
}

ViewPostScreen.propTypes = {
  id: PropTypes.string.isRequired,
  screenProps: PropTypes.object.isRequired,
  current_tab: PropTypes.string.isRequired,
  pushTabRoute: PropTypes.func.isRequired,
  post_likes: PropTypes.object.isRequired,
  goBackwardTabRoute: PropTypes.func.isRequired,
  removePostScreenInfo: PropTypes.func.isRequired,
  getPostComments: PropTypes.func.isRequired,
  none_msg: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
  }
});

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps);
  // TODO: Use ownProps to get the screenID and postID
  // Have this.props.loading and this.props.initial_loading based off of the results
  return {
    id: state.auth.id,
    current_tab: state.navigation.current_tab,
    post_likes: state.posts.post_likes,
    none_msg: state.comments.none_msg
  };
};

export default connect(mapStateToProps, {
  pushTabRoute,
  goBackwardTabRoute,
  removePostScreenInfo,
  getPostComments
})(ViewPostScreen);
