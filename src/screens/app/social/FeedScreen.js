import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Keyboard, Animated, Dimensions, ScrollView } from 'react-native';
import { SearchHeader } from '../../../components/common';
import { SEARCH_HEADER_HEIGHT } from '../../../constants/variables';

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

class FeedScreen extends Component {
  state = { search: '', typingTimeout: null }

  handleCancelPress = () => {
    Keyboard.dismiss();
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState(() => ({ search: '', typingTimeout: null }));
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
        console.log(this.state.search);
      }, 1000)
    }));
  }

  handleSubmitEditing = () => {
    Keyboard.dismiss();
    console.log(`search up: ${this.state.search} in feed`);
    // TODO: Figure out how to query database
  }

  handleScroll = () => Keyboard.dismiss()

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader
          placeholder="Search Feed..."
          value={this.state.search}
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing}
          onCancelPress={this.handleCancelPress}
          animationDuration={200}
        />
        <ScrollView
          ref={o => (this.animScrollView = o)}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
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
        </ScrollView>
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
