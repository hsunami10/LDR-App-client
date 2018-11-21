import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StandardHeader } from '../../../components/common';
import PostCard from '../../../components/post/PostCard';
import { pushTabRoute, goBackwardTabRoute } from '../../../actions/NavigationActions';
import { removePostScreenInfo } from '../../../actions/ScreenActions';
import { getPostComments } from '../../../actions/PostActions';

// TODO: componentDidMount / reload, store in app state screens - like ViewProfileScreen
class ViewPostScreen extends Component {
  state = {
    height: 0,
    post_id: ''
  }

  componentDidMount() {
    this.handleFirstLoad(false);
  }

  componentWillUnmount() {
    this.props.goBackwardTabRoute();
    this.props.removePostScreenInfo(this.state.post_id, this.props.screenID);
  }

  viewProfile = id => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id
    });
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  handleFirstLoad = refresh => {
    const post = this.props.navigation.getParam('post', {});
    this.setState(() => ({ post_id: post.id }));
    // TODO: Implement this function later
    this.props.getPostComments(post, this.props.screenID);
  }

  handleLeftPress = () => {
    // TODO: Update app state if needed
    this.props.navigation.pop();
  }

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
        <Text>No comments available</Text>
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
  screenID: PropTypes.string.isRequired
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
    post_likes: state.screens.posts.post_likes
  };
};

export default connect(mapStateToProps, {
  pushTabRoute,
  goBackwardTabRoute,
  removePostScreenInfo,
  getPostComments
})(ViewPostScreen);
