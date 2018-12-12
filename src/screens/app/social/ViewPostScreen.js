import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, ScrollView, RefreshControl, Keyboard, Text } from 'react-native';
import shortid from 'shortid';
import { StandardHeader, FullScreenLoading, AutoExpandingTextInput } from '../../../components/common';
import PostCard from '../../../components/post/PostCard';
import { pushTabRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';
import { removePostScreenInfo } from '../../../actions/ScreenActions';
import { getPostAndComments, deletePost } from '../../../actions/PostActions';
import { getComments } from '../../../actions/CommentActions';
import CommentsList from '../../../components/comment/CommentsList';
import PageCommentsButton from '../../../components/comment/PageCommentsButton';
import { NO_POST_MSG } from '../../../constants/noneMessages';

class ViewPostScreen extends Component {
  state = {
    height: 0,
    post_height: 0,
    screen_id: shortid(),
    post_id: null,
    text: ''
  }

  componentDidMount() {
    const postID = this.props.navigation.getParam('post_id', null);
    this.setState(() => ({ post_id: postID }));
    this.handleFirstLoad(false);
  }

  componentWillUnmount() {
    this.props.goBackwardTabRoute();
    this.props.removePostScreenInfo(this.state.post_id, this.state.screen_id);
  }

  // Convert to array of objects
  getComments = () => {
    const postIDs = this.props.posts[this.state.post_id][this.state.screen_id].order;
    const comments = new Array(postIDs.length);
    for (let i = 0, len = comments.length; i < len; i++) {
      comments[i] = this.props.all_comments[postIDs[i]];
    }
    return comments;
  }

  viewProfile = (id, username) => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id,
      username
    });
  }

  handleFirstLoad = refresh => {
    let order;
    const postID = this.props.navigation.getParam('post_id', null);
    if (refresh) { // Handle first load
      order = this.props.posts[this.state.post_id][this.state.screen_id].order;
    } else {
      order = [];
    }
    this.props.getPostAndComments(
      this.props.id,
      postID,
      this.state.screen_id,
      order.length === 0 ? 0 : this.props.all_comments[order[0]].date_sent, // Handle index out of bounds if no comments
      refresh,
      this.props.navigation
    );
  }

  handleNoPostError = () => this.props.deletePost(this.props.id, this.state.post_id, this.props.navigation)

  handlePageComments = () => {
    const screenInfo = this.props.posts[this.state.post_id][this.state.screen_id];
    this.props.getComments(
      this.props.id,
      this.state.post_id,
      this.state.screen_id,
      screenInfo.offset,
      this.props.all_comments[screenInfo.order[screenInfo.order.length - 1]].date_sent,
      this.handleNoPostError
    );
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
  handleChangeText = text => this.setState(() => ({ text }))
  handleScroll = () => Keyboard.dismiss();

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

  renderBody = () => {
    const post = this.props.all_posts[this.state.post_id || this.props.navigation.getParam('post_id', null)];
    if (!post) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>{NO_POST_MSG}</Text>
        </View>
      );
    }
    return (
      <ScrollView
        onScroll={this.handleScroll}
        scrollEventThrottle={16}
        refreshControl={this.handleRefreshControl()}
        onLayout={this.handleLayout}
      >
        <PostCard
          userID={this.props.id}
          post={post}
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
        <AutoExpandingTextInput
          value={this.state.text}
          placeholder="Comment..."
          onChangeText={this.handleChangeText}
          onContentSizeChange={height => {
            console.log('content size height: ' + height);
          }}
        />
      </ScrollView>
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
      <View>
        <PageCommentsButton
          keepPaging={this.props.posts[this.state.post_id][this.state.screen_id].keepPaging}
          loading={this.props.posts[this.state.post_id][this.state.screen_id].page_comments_loading}
          handlePress={this.handlePageComments}
        />
        <CommentsList
          data={data}
          empty={data.length === 0}
          navigation={this.props.navigation}
          parentNavigation={this.props.screenProps.parentNavigation}
        />
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
        {this.renderBody()}
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
  getComments: PropTypes.func.isRequired,
  posts: PropTypes.object.isRequired,
  all_comments: PropTypes.object.isRequired,
  getPostAndComments: PropTypes.func.isRequired,
  all_posts: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired
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
  posts: state.screens.posts,
  all_comments: state.comments.all_comments,
  all_posts: state.posts.all_posts
});

export default connect(mapStateToProps, {
  pushTabRoute,
  goBackwardTabRoute,
  removePostScreenInfo,
  getComments,
  getPostAndComments,
  deletePost
})(ViewPostScreen);
