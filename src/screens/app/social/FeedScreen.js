import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import shortid from 'shortid';
import { View, Text, StyleSheet, Keyboard, RefreshControl, Dimensions, FlatList, Animated } from 'react-native';
import { SearchHeader, FullScreenLoading } from '../../../components/common';
import PostCard from '../../../components/post/PostCard';
import GeneralSearchScreen from '../GeneralSearchScreen';
import { getUserFeed } from '../../../actions/FeedActions';
import { pushTabRoute } from '../../../actions/NavigationActions';
import { setSelectedUser } from '../../../actions/UserActions';

// TODO: Add 3 tabs later - Feed, Topics, Friends

/*
HOW TO POPULATE THIS SCREEN
Show posts with a search header on top to search / filter for keywords

Animation Help - https://www.youtube.com/watch?v=vzPmI0GCDPM

NOTE: Get data from database (for regular feed), but when user searches, search with data retrieved from database
- or maybe search WITH database? might be heavy + slower
- but might be better because what if the user types something before data is retrieved from database? - slow internet
- then they cannot search anything until the data is retrieved
- could disable search...but that will be kind of bad

NOTE: Combine multiple select queries and order by example
(select id, date_joined from aliases) UNION ALL (select id, date_joined from users) ORDER BY date_joined asc;
https://stackoverflow.com/questions/11828772/postgresql-combine-multiple-select-statements

TODO: Figure out how to get and organize data from database
Things to keep in mind:
  Exclude:
    - partner's aliases
    - blocked users
  Include:
    - topics subscribed to
    - friends' posts
    - your posts
Order from: (top to bottom) most recent to oldest

First get data for exclusions
Run loops to create the correct query string
Apply those query strings to the inclusions
 */

// NOTE: TODO: COPY SEARCH FUNCTIONALITY FROM DISCOVERSCREEN
// OR HANDLE SEARCHES IN MAIN SCREEN
class FeedScreen extends Component {
  state = {
    search: '',
    oldSearch: '',
    typingTimeout: null,
    opacity: new Animated.Value(0),
    display: 'none',
    height: 0,
    canPaginate: false,
    posts2: [
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
    ]
  }

  componentDidMount() {
    if (this.props.current_route === 'feed') {
      this.props.getUserFeed(this.props.id, 0, true, 'date_posted', 'DESC', moment().unix());
    }
  }

  handleScroll = () => Keyboard.dismiss()
  handleRefresh = () => this.props.getUserFeed(this.props.id, 0, false, 'date_posted', 'DESC', moment().unix())

  handleContentSizeChange = (contentWidth, contentHeight) => {
    this.setState(prevState => ({
      canPaginate: contentHeight > prevState.height // Only allow pagination if content height is larger than FlatList height
    }));
  }

  handleEndReached = () => {
    // canPaginate - true ONLY when content is overflowing
    // keepPaging - true ONLY when there is more data to retrieve
    if (this.state.canPaginate && this.props.keepPaging) {
      this.props.getUserFeed(
        this.props.id,
        this.props.offset,
        null,
        'date_posted',
        'DESC',
        parseInt(this.props.posts[0].date_posted, 10) // Ignore newer posts when paging
      );
    }
  };

  searchResults = () => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    if (this.state.oldSearch !== this.state.search) {
      console.log(`search up: ${this.state.search} in general search`);
      // TODO: Figure out how to query database
      // Store search result in database - discover_searches
    }
    this.setState(() => ({ oldSearch: this.state.search, typingTimeout: null }));
  }

  handleSearchFocus = () => {
    this.setState(() => ({ display: 'flex' }));
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  handleCancelPress = () => {
    Keyboard.dismiss();
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState(() => ({ search: '', typingTimeout: null }));
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      this.setState(() => ({ display: 'none' }));
      // TODO: Reset search results - back to default animated view
    });
  }

  handleChangeText = search => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState(() => ({
      search,
      typingTimeout: setTimeout(() => {
        // TODO: Call action for API endpoint here
        // Query data from database here
        if (this.state.search.length !== 0) {
          console.log(`show '${this.state.search}' top (10?) popular searches of all time`);
        }
      }, 1000)
    }));
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  viewProfile = id => {
    this.props.setSelectedUser({ id });
    this.props.pushTabRoute(this.props.current_tab, 'ViewProfile');
    this.props.navigation.navigate('ViewProfile');
  }

  // TODO: Render actual posts later - post / card component
  renderPosts = post => <PostCard userID={this.props.id} post={post.item} viewProfile={this.viewProfile} />
  renderMessage = message => <Text style={{ marginTop: 50, alignSelf: 'center', textAlign: 'center' }}>{message.item.text}</Text>

  renderBody = () => {
    if (this.state.height === 0) { // Get rid of small jump in spinning icon
      return null;
    } else if (this.props.initial_loading) { // Only true once, on componentDidMount
      return <FullScreenLoading height={this.state.height} loading />;
    }
    return (
      <FlatList
        data={this.props.posts}
        renderItem={this.props.message === '' ? this.renderPosts : this.renderMessage}
        keyExtractor={post => post.id}
        onScroll={this.handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={this.props.loading}
            onRefresh={this.handleRefresh}
          />
        }
        onContentSizeChange={this.handleContentSizeChange}
        onEndReached={this.handleEndReached}
        onEndReachedThreshold={0}
      />
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader
          placeholder="Search..."
          value={this.state.search}
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.searchResults}
          onFocus={this.handleSearchFocus}
          onCancelPress={this.handleCancelPress}
          animationDuration={200}
          returnKeyType="search"
        />
        <View
          style={{ flex: 1 }}
          onLayout={this.handleLayout}
        >
          {this.renderBody()}
          <GeneralSearchScreen
            display={this.state.display}
            opacity={this.state.opacity}
            height={this.state.height}
            results={this.state.posts2}
          />
        </View>
      </View>
    );
  }
}

FeedScreen.propTypes = {
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  initial_loading: PropTypes.bool.isRequired,
  posts: PropTypes.array.isRequired,
  getUserFeed: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  keepPaging: PropTypes.bool.isRequired,
  pushTabRoute: PropTypes.func.isRequired,
  setSelectedUser: PropTypes.func.isRequired,
  current_route: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchViewStyle: {
    backgroundColor: 'blue',
    position: 'absolute',
    width: Dimensions.get('window').width
  }
});

const mapStateToProps = state => {
  // Pre-process posts if there are none to see
  let posts = state.feed.posts;
  if (posts.length === 0) {
    posts = [{ id: '0', text: state.feed.message }];
  }
  return {
    id: state.auth.id,
    loading: state.feed.loading,
    initial_loading: state.feed.initial_loading,
    current_route: state.navigation.current_route,
    current_tab: state.navigation.current_tab,
    offset: state.feed.offset,
    message: state.feed.message,
    posts,
    keepPaging: state.feed.keepPaging
  };
};

export default connect(mapStateToProps, {
  getUserFeed,
  pushTabRoute,
  setSelectedUser
})(FeedScreen);
