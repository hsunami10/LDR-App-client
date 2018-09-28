import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Keyboard, Animated, Dimensions } from 'react-native';
import { SearchHeader } from '../../../components/common';
import { SEARCH_HEADER_HEIGHT } from '../../../constants/variables';

/*
HOW TO POPULATE THIS SCREEN
Show posts with a search header on top

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

class FeedScreen extends Component {
  state = {
    search: '',
    opacity: new Animated.Value(0),
    // typingTimeout: null
  }

  handleSearchFocus = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  handleCancelPress = () => {
    Keyboard.dismiss();
    this.setState(() => ({ search: '' }));
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      this.animScrollView.getNode().scrollTo({ x: 0, y: 0, animated: false });
      // TODO: Reset search results - back to default animated view
    });
  }

  handleChangeText = search => {
    this.setState(() => ({ search }));

    // QUESTION: Should I do this? Might be heavy on backend
    // Could run into some race conditions
    // if (this.state.typingTimeout) {
    //   clearTimeout(this.state.typingTimeout);
    // }
    //
    // this.setState(() => ({
    //   search,
    //   typingTimeout: setTimeout(() => {
    //     // TODO: Call action for API endpoint here
    //     // Query data from database here
    //     console.log('SEARCH FEED');
    //   }, 1000)
    // }));
  }

  handleSubmitEditing = () => {
    Keyboard.dismiss();
    console.log(`search up: ${this.state.search} in feed`);
    // QUESTION: Maybe navigation to a results screen, like in facebook and vent?
    // TODO: Figure out how to query database
  }

  handleScroll = () => {
    Keyboard.dismiss();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader
          placeholder="Search Feed..."
          value={this.state.search}
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing}
          onFocus={this.handleSearchFocus}
          onCancelPress={this.handleCancelPress}
          animationDuration={200}
        />
        <View style={styles.centerItems}>
          <View>
            <Text>Feed Screen!</Text>
          </View>
          <Animated.ScrollView
            ref={o => (this.animScrollView = o)}
            onScroll={this.handleScroll}
            scrollEventThrottle={16}
            style={[styles.searchViewStyle, {
              opacity: this.state.opacity,
              height: Dimensions.get('window').height - SEARCH_HEADER_HEIGHT - 80 // TODO: Get tab view height
            }]}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
              <Text>Animated View</Text>
            </View>
          </Animated.ScrollView>
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
