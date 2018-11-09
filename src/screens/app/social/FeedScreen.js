import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { View, Text, StyleSheet, Keyboard, RefreshControl, Dimensions, FlatList, Animated } from 'react-native';
import { SearchHeader } from '../../../components/common';
import GeneralSearchScreen from '../../../components/GeneralSearchScreen';

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
    - users subscribed to
    - friends' posts
    - posts you made
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
    refreshing: false,
    display: 'none',
    height: 0,
    posts: [
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
    ],
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

  handleScroll = () => Keyboard.dismiss()

  handleEndReached = () => {
    // TODO: Handle pagination here
    // If no more old data, then don't do anything anymore
    console.log('feed paginate for new data here');
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

  handleRefresh = () => {
    this.setState(() => ({ refreshing: true }));
    // TODO: Grab new data from database again here, and set refreshing to false
    setTimeout(() => this.setState(() => ({ refreshing: false })), 1000);
  }

  handleLayout = e => {
    const height = e.nativeEvent.layout.height;
    this.setState(() => ({ height }));
  }

  renderItem = post => {
    return <Text style={{ alignSelf: 'center' }}>{post.item.text}</Text>;
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
          <FlatList
            data={this.state.posts}
            renderItem={this.renderItem}
            keyExtractor={post => post.id}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.handleRefresh}
              />
            }
            onEndReached={this.handleEndReached}
            onEndReachedThreshold={0}
          />
          <Animated.View
            style={[styles.searchViewStyle, {
              display: this.state.display,
              opacity: this.state.opacity,
              height: this.state.height
            }]}
          >
            <GeneralSearchScreen
              display={this.state.display}
              opacity={this.state.opacity}
              height={this.state.height}
              results={this.state.posts2}
            />
          </Animated.View>
        </View>
      </View>
    );
  }
}

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

export default FeedScreen;
