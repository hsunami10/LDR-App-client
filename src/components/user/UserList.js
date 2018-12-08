import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, View, StyleSheet, RefreshControl, Text, Button } from 'react-native';
import UserCard from './UserCard';
import { requireWhenPropExists } from '../../assets/helpers';

class UserList extends Component {
  state = {
    canPaginate: false,
    sortModalVisible: false,
    sortButtonText: 'Newest'
  }

  viewProfile = (id, username) => {
    // QUESTION: navigation or parentNavigation?
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id,
      username
    });
  }

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
    if (index === 0 && this.props.allowSorting) {
      return (
        <Button
          title={`Sort by: ${this.state.sortButtonText}`}
          onPress={this.showSortModal}
        />
      );
    } else if (index === 0 && !this.props.allowSorting) {
      return null;
    }
    return (
      <UserCard
        user={item}
        onPress={this.viewProfile}
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
          scrollEnabled={this.props.disableScrolling}
          renderItem={this.props.empty ? this.renderMessage : this.renderPosts}
          keyExtractor={post => post.id}
          onScroll={this.props.handleScroll}
          scrollEventThrottle={this.props.scrollEventThrottle || 16}
          refreshControl={
            this.props.disableRefresh ?
            null :
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.handleRefresh}
            />
          }
          onContentSizeChange={this.handleContentSizeChange}
          onEndReached={this.handleEndReached}
          onEndReachedThreshold={0}
        />
      </View>
    );
  }
}

UserList.propTypes = {
  id: PropTypes.string.isRequired,

  data: PropTypes.arrayOf(PropTypes.object).isRequired, // Array of 1 object with { id, text } if no posts to show
  empty: PropTypes.bool.isRequired,
  height: PropTypes.number.isRequired,
  refreshing: (props, propName, componentName) => requireWhenPropExists('handleRefresh', props, propName, componentName, 'boolean'),
  handleRefresh: PropTypes.func,
  paginateData: PropTypes.func.isRequired,
  keepPaging: PropTypes.bool.isRequired, // False only when there is no more data to retrieve
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  allowSorting: PropTypes.bool,
  sortPosts: (props, propName, componentName) => requireWhenPropExists('allowSorting', props, propName, componentName, 'function'), // 2 params - order (date_posted, num_likes), direction (DESC, DESC)
  handleScroll: PropTypes.func,
  scrollEventThrottle: PropTypes.number,
  disableRefresh: PropTypes.bool,
  disableScrolling: PropTypes.bool
};

const mapStateToProps = state => ({
  id: state.auth.id
});

export default connect(mapStateToProps, null)(UserList);
