import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, FlatList, RefreshControl, Button, SectionList, StyleSheet } from 'react-native';
import { pushTabRoute } from '../actions/NavigationActions';
import PostCard from './post/PostCard';
import TopicCard from './topic/TopicCard';
import UserCard from './user/UserCard';
import SortModal from './post/SortModal';
import { requireWhenPropExists } from '../assets/helpers/errors/proptypes';

class DataList extends Component {
  state = {
    canPaginate: false,
    sortModalVisible: false,
    sortButtonText: ''
  }

  componentDidMount() {
    switch (this.props.type) {
      case 'posts':
        this.setState(() => ({ sortButtonText: 'Newest' }));
        break;
      case 'topics':
        break;
      case 'users':
        break;
      default:
        break;
    }
  }

  viewProfile = (id, username) => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.push('ViewProfile', {
      type: 'public',
      id,
      username
    });
  }

  viewPost = post => {
    this.props.pushTabRoute(this.props.current_tab, 'ViewPost');
    this.props.navigation.push('ViewPost', { post_id: post.id });
  }

  handleUserActionPress = (id, type) => {
    switch (type) {
      case 'regular':
        console.log(`send a friend request to this user with id: ${id}`);
        break;
      case 'friend':
        console.log(`unfriend this user with id: ${id}`);
        break;
      case 'pending':
        console.log(`cancel friend request to this user with id: ${id}`);
        break;
      default:
        break;
    }
  }

  handleUserRequestPress = (id, accepted) => {
    console.log(`request accepted? ${accepted} for user with id: ${id}`);
  }

  // choice -> sort string to display on button
  handleSortSelect = choice => {
    this.setState(prevState => ({
      sortModalVisible: !prevState.sortModalVisible,
      sortButtonText: choice || prevState.sortButtonText
    }));
    if (this.state.sortButtonText === choice || !choice) {
      return;
    }

    let order = '';
    let direction = '';
    switch (this.props.type) {
      case 'posts':
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
            break;
        }
        break;
      case 'topics':
        break;
      case 'users':
        break;
      default:
        break;
    }
    this.props.sortData(order, direction);
  }

  handleContentSizeChange = (contentWidth, contentHeight) => {
    if (this.props.height) {
      this.setState(() => ({
        canPaginate: contentHeight > this.props.height // Only allow pagination if content height is larger than FlatList height
      }));
    }
  }

  handleEndReached = () => {
    // canPaginate - true ONLY when content is overflowing
    // keepPaging - true ONLY when there is more data to retrieve
    if (this.state.canPaginate && this.props.keepPaging) {
      this.props.paginateData();
    }
  }

  showSortModal = () => this.setState(prevState => ({ sortModalVisible: !prevState.sortModalVisible }))

  renderData = ({ item, index }) => {
    if (typeof item === 'string') { // Only true if empty data for section index, since array.size = 1, string
      return <Text style={{ alignSelf: 'center' }}>{item}</Text>;
    }
    if (index === 0 && this.props.enableSorting) {
      return (
        <Button
          title={`Sort by: ${this.state.sortButtonText}`}
          onPress={this.showSortModal}
        />
      );
    } else if (index === 0 && !this.props.enableSorting) {
      return null;
    }
    switch (this.props.type) {
      case 'posts':
        return (
          <PostCard
            key={item.id}
            userID={this.props.id}
            post={item}
            viewProfile={this.viewProfile}
            viewPost={this.viewPost}
            navigation={this.props.navigation}
            parentNavigation={this.props.parentNavigation}
          />
        );
      case 'topics':
        return (
          <TopicCard
            key={item.id}
            topic={item}
            onPress={() => this.props.onItemSelect(item)}
          />
        );
      case 'users':
        return (
          <UserCard
            user={item}
            onUserPress={this.viewProfile}
            onActionPress={this.handleUserActionPress}
            onRequestPress={this.handleUserRequestPress}
          />
        );
      default:
        return null;
    }
  }

  renderMessage = ({ item }) => (
    <Text style={{ marginTop: 50, alignSelf: 'center', textAlign: 'center' }}>{item.text}</Text>
  )

  renderSortModal = () => {
    switch (this.props.type) {
      case 'posts':
        if (this.props.enableSorting) {
          return (
            <SortModal
              isVisible={this.state.sortModalVisible}
              onChoiceSelect={this.handleSortSelect}
              selected={this.state.sortButtonText}
            />
          );
        }
        return null;
      case 'topics':
        break;
      case 'users':
        break;
      default:
        return null;
    }
  }

  renderSections = () => {
    const result = new Array(this.props.sectionTitles.length);
    for (let i = 0, len = this.props.sectionTitles.length; i < len; i++) {
      result[i] = {
        title: <Text style={styles.sectionTitleStyle}>{this.props.sectionTitles[i]}</Text>,
        data: this.props.sectionData[i].length === 0 ? [this.props.emptyMessages[i]] : this.props.sectionData[i]
      };
    }
    return result;
  }

  renderSectionHeader = ({ section: { title } }) => (
    <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{title}</Text>
  )

  render() {
    if (this.props.sectionList) {
      return (
        <SectionList
          renderItem={this.renderData}
          renderSectionHeader={this.renderSectionHeader}
          sections={this.renderSections()}
          keyExtractor={(item, index) => item + index}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
        />
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={
            this.props.empty ?
            [{ id: 'foo', text: this.props.message }] :
            [{ id: 'foo' }, ...this.props.data] // First value - dummy value for sort by functionality
          }
          renderItem={this.props.empty ? this.renderMessage : this.renderData}
          keyExtractor={post => post.id}
          onScroll={this.props.handleScroll}
          refreshControl={
            this.props.enableRefresh ?
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this.props.handleRefresh}
            /> :
            null
          }
          onContentSizeChange={this.handleContentSizeChange}
          onEndReached={this.handleEndReached}
          scrollEventThrottle={16}
          onEndReachedThreshold={0}
        />
        {this.renderSortModal()}
      </View>
    );
  }
}

DataList.propTypes = {
  id: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired,
  pushTabRoute: PropTypes.func.isRequired,

  type: PropTypes.oneOf(['posts', 'topics', 'users']).isRequired,
  navigation: PropTypes.object,
  parentNavigation: PropTypes.object,
  handleScroll: PropTypes.func,
  onItemSelect: PropTypes.func,

  // FlatList required props
  flatList: PropTypes.bool,
  data: (props, propName, componentName) => requireWhenPropExists('flatList', props, propName, componentName, 'object'), // Array of 1 object with { id, text } if no posts to show
  empty: (props, propName, componentName) => requireWhenPropExists('flatList', props, propName, componentName, 'boolean'),
  message: (props, propName, componentName) => requireWhenPropExists('flatList', props, propName, componentName, 'string'),

  // SectionList required props
  sectionList: PropTypes.bool,
  sectionTitles: (props, propName, componentName) => requireWhenPropExists('sectionList', props, propName, componentName, 'object'),
  sectionData: (props, propName, componentName) => requireWhenPropExists('sectionList', props, propName, componentName, 'object'),
  emptyMessages: (props, propName, componentName) => requireWhenPropExists('sectionList', props, propName, componentName, 'object'),

  // Refreshing
  enableRefresh: PropTypes.bool,
  handleRefresh: (props, propName, componentName) => requireWhenPropExists('enableRefresh', props, propName, componentName, 'function'),
  refreshing: (props, propName, componentName) => requireWhenPropExists('enableRefresh', props, propName, componentName, 'boolean'),

  // Pagination
  enablePaging: PropTypes.bool,
  paginateData: (props, propName, componentName) => requireWhenPropExists('enablePaging', props, propName, componentName, 'function'),
  keepPaging: (props, propName, componentName) => requireWhenPropExists('enablePaging', props, propName, componentName, 'boolean'), // False only when there is no more data to retrieve
  height: (props, propName, componentName) => requireWhenPropExists('enablePaging', props, propName, componentName, 'number'),

  // Sorting
  enableSorting: PropTypes.bool, // Cannot allow sorting if sectioned list
  sortData: (props, propName, componentName) => requireWhenPropExists('enableSorting', props, propName, componentName, 'function'), // 2 params - order (date_posted, num_likes), direction (DESC, DESC)
};

const mapStateToProps = state => ({
  id: state.auth.id,
  current_tab: state.navigation.current_tab
});

const styles = StyleSheet.create({
  sectionTitleStyle: {
    backgroundColor: 'white'
  }
});

export default connect(mapStateToProps, {
  pushTabRoute
})(DataList);
