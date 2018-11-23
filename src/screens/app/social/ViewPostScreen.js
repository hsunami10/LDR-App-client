import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import shortid from 'shortid';
import moment from 'moment';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import PostCard from '../../../components/post/PostCard';
import { pushTabRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';
import { removePostScreenInfo } from '../../../actions/ScreenActions';
import { getPostComments } from '../../../actions/PostActions';
import CommentsList from '../../../components/comment/CommentsList';

// 3 types of loading:
//  - on mount, initial_loading for comments, get /api/posts/comments/, offset = 0 (initial_comments_loading)
//  - on refresh, update post and comments, get /api/posts/, add to end of comments (refreshing)
//  - view previous comments, get /api/posts/comments/, offset > 0, add to beginning of comments (page_comments_loading)
// If no comments, then show "no comments" message and DO NOT allow "view previous comments"
// Hide "view previous comments" if number of comments fetched is < limit (5)
// TODO: Figure out how to do separate screen loading, similar to ViewPostScreen, in ScreenReducer
class ViewPostScreen extends Component {
  state = {
    height: 0,
    post_height: 0,
    screen_id: shortid(),
    post_id: ''
  }

  componentDidMount() {
    const post = this.props.navigation.getParam('post', null);
    this.setState(() => ({ post_id: post.id }));
    this.handleFirstLoad(false);
  }

  componentWillUnmount() {
    this.props.goBackwardTabRoute();
    this.props.removePostScreenInfo(this.state.post_id, this.state.screen_id);
  }

  getComments = () => {
    const postIDs = this.props.posts[this.state.post_id][this.state.screen_id].order;
    const comments = new Array(postIDs.length);
    for (let i = 0, len = comments.length; i < len; i++) {
      comments[i] = this.props.all_comments[postIDs[i]];
    }
    return comments;
  }

  viewProfile = id => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id
    });
  }

  handleFirstLoad = refresh => {
    const post = this.props.navigation.getParam('post', null);
    if (!refresh) {
      this.props.getPostComments(this.props.id, post.id, this.state.screen_id, false, 0, moment().unix());
    } else {
      // TODO: get /api/posts/
      console.log('get post and comments');
    }
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }
  handlePostLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ post_height: height }));
  }

  handleLeftPress = () => this.props.navigation.pop()
  handleRefresh = () => this.handleFirstLoad(true)

  // Only allow refresh if not initial loading
  handleRefreshControl = () => {
    if ( // NOTE: Same as renderComments if statement
      this.props.posts[this.state.post_id] === undefined ||
      this.props.posts[this.state.post_id][this.state.screen_id] === undefined ||
      this.props.posts[this.state.post_id][this.state.screen_id].initial_comments_loading
    ) {
      return null;
    }
    return (
      <RefreshControl
        refreshing={this.props.posts[this.state.post_id][this.state.screen_id].refreshing}
        onRefresh={this.handleRefresh}
      />
    );
  }

  renderComments = () => {
    if (this.state.height === 0 || this.state.post_height === 0) {
      return null;
    } else if ( // NOTE: Same as handleRefreshControl if statement
      this.props.posts[this.state.post_id] === undefined ||
      this.props.posts[this.state.post_id][this.state.screen_id] === undefined ||
      this.props.posts[this.state.post_id][this.state.screen_id].initial_comments_loading
    ) {
      return <FullScreenLoading height={this.state.height - this.state.post_height} loading />;
    }

    const data = this.getComments(this.props.posts[this.state.post_id][this.state.screen_id].order);
    return (
      <CommentsList
        data={data}
        empty={data.length === 0}
        navigation={this.props.navigation}
        parentNavigation={this.props.screenProps.parentNavigation}
      />
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
          refreshControl={this.handleRefreshControl()}
          onLayout={this.handleLayout}
        >
          <PostCard
            userID={this.props.id}
            post={this.props.navigation.getParam('post', {})}
            viewProfile={this.viewProfile}
            postLikes={this.props.post_likes}
            navigation={this.props.navigation}
            parentNavigation={this.props.screenProps.parentNavigation}
            viewing
            onLayout={this.handlePostLayout}
          />
          <View style={{ flex: 1 }}>
            {this.renderComments()}
          </View>
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
  none_msg: PropTypes.string.isRequired,
  posts: PropTypes.object.isRequired,
  all_comments: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
  }
});

const mapStateToProps = state => ({
  id: state.auth.id,
  current_tab: state.navigation.current_tab,
  post_likes: state.posts.post_likes,
  none_msg: state.comments.none_msg,
  posts: state.screens.posts,
  all_comments: state.comments.all_comments
});

export default connect(mapStateToProps, {
  pushTabRoute,
  goBackwardTabRoute,
  removePostScreenInfo,
  getPostComments
})(ViewPostScreen);
