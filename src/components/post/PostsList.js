import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { Text, FlatList, RefreshControl, Keyboard } from 'react-native';
import { pushTabRoute } from '../../actions/NavigationActions';
import PostCard from './PostCard';

class PostsList extends Component {
  state = {
    canPaginate: false
  }

  viewProfile = id => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id,
      screenID: shortid()
    });
  }

  viewPost = post => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewPost');
    this.props.navigation.push('ViewPost', { post, screenID: shortid() });
  }

  handleScroll = () => Keyboard.dismiss()

  handleContentSizeChange = (contentWidth, contentHeight) => {
    this.setState(() => ({
      canPaginate: contentHeight > this.props.height // Only allow pagination if content height is larger than FlatList height
    }));
  }

  handleEndReached = () => {
    // canPaginate - true ONLY when content is overflowing
    // keepPaging - true ONLY when there is more data to retrieve
    if (this.state.canPaginate && this.props.keepPaging) {
      this.props.paginateData();
    }
  }

  renderPosts = ({ item }) => (
    <PostCard
      userID={this.props.id}
      post={item}
      viewProfile={this.viewProfile}
      viewPost={this.viewPost}
      navigation={this.props.navigation}
      parentNavigation={this.props.parentNavigation}
    />
  )

  renderMessage = ({ item }) => (
    <Text style={{ marginTop: 50, alignSelf: 'center', textAlign: 'center' }}>{item.text}</Text>
  )

  render() {
    return (
      <FlatList
        data={this.props.empty ? [{ id: 'foo', text: this.props.message }] : this.props.data}
        renderItem={this.props.empty ? this.renderMessage : this.renderPosts}
        keyExtractor={post => post.id}
        onScroll={this.props.handleScroll || this.handleScroll}
        scrollEventThrottle={this.props.scrollEventThrottle || 16}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.handleRefresh}
          />
        }
        onContentSizeChange={this.handleContentSizeChange}
        onEndReached={this.handleEndReached}
        onEndReachedThreshold={0}
      />
    );
  }
}

PostsList.propTypes = {
  id: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired,

  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of 1 object with { id, text } if no posts to show
  empty: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  refreshing: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  pushTabRoute: PropTypes.func.isRequired,
  paginateData: PropTypes.func.isRequired,
  keepPaging: PropTypes.bool.isRequired, // False only when there is no more data to retrieve
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,

  handleScroll: PropTypes.func,
  scrollEventThrottle: PropTypes.number
};

const mapStateToProps = state => ({
  id: state.auth.id,
  current_tab: state.navigation.current_tab
});

export default connect(mapStateToProps, {
  pushTabRoute
})(PostsList);
