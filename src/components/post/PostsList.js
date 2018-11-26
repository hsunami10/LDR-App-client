import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, FlatList, RefreshControl, Keyboard, Button } from 'react-native';
import { pushTabRoute } from '../../actions/NavigationActions';
import PostCard from './PostCard';
import SortModal from './SortModal';

class PostsList extends Component {
  state = {
    canPaginate: false,
    sortModalVisible: false,
    sortButtonText: 'Newest'
  }

  viewProfile = id => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id
    });
  }

  viewPost = post => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewPost');
    this.props.navigation.push('ViewPost', { post_id: post.id });
  }

  handleScroll = () => Keyboard.dismiss()

  // 'Newest', 'Popular'
  handleChoiceSelect = choice => {
    this.setState(prevState => ({
      sortModalVisible: !prevState.sortModalVisible,
      sortButtonText: choice || prevState.sortButtonText
    }));
    if (this.state.sortButtonText === choice) {
      return;
    }

    let order = '';
    let direction = '';
    switch (choice) {
      case 'Newest':
        order = 'date_posted';
        direction = 'DESC';
        break;
      case 'Popular':
        order = 'num_likes';
        direction = 'DESC';
        break;
      default:
        return;
    }
    this.props.sortPosts(order, direction);
  }

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

  showSortModal = () => this.setState(prevState => ({ sortModalVisible: !prevState.sortModalVisible }))

  renderPosts = ({ item, index }) => {
    if (index === 0) {
      return (
        <Button
          title={`Sort by: ${this.state.sortButtonText}`}
          onPress={this.showSortModal}
        />
      );
    }
    return (
      <PostCard
        userID={this.props.id}
        post={item}
        viewProfile={this.viewProfile}
        viewPost={this.viewPost}
        navigation={this.props.navigation}
        parentNavigation={this.props.parentNavigation}
      />
    );
  }

  renderMessage = ({ item }) => (
    <Text style={{ marginTop: 50, alignSelf: 'center', textAlign: 'center' }}>{item.text}</Text>
  )

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={
            this.props.empty ?
            [{ id: 'foo', text: this.props.message }] :
            [{ id: 'foo' }, ...this.props.data]
          }
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
        <SortModal
          isVisible={this.state.sortModalVisible}
          onChoiceSelect={this.handleChoiceSelect}
          selected={this.state.sortButtonText}
        />
      </View>
    );
  }
}

PostsList.propTypes = {
  id: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired,
  pushTabRoute: PropTypes.func.isRequired,

  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of 1 object with { id, text } if no posts to show
  empty: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  refreshing: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  paginateData: PropTypes.func.isRequired,
  keepPaging: PropTypes.bool.isRequired, // False only when there is no more data to retrieve
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  sortPosts: PropTypes.func.isRequired, // 2 params - order (date_posted, num_likes), direction (DESC, DESC)
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
