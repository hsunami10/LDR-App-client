import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Keyboard, Animated } from 'react-native';
import { SearchHeader } from '../../../components/common';

/*
HOW TO POPULATE THIS SCREEN
Show posts with a search header on top

Animation Help - https://www.youtube.com/watch?v=vzPmI0GCDPM

TODO: Figure out how to get and organize data from database
 */

class FeedScreen extends Component {
  state = { search: '', opacity: new Animated.Value(0) }

  handleSearchFocus = () => {
    console.log('focus');
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  handleCancelPress = () => {
    Keyboard.dismiss();
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start();
    console.log('cancel pressed');
  }

  handleChangeText = search => this.setState(() => ({ search }));

  handleSubmitEditing = () => {
    Keyboard.dismiss();
    console.log(`search up: ${this.state.search} in feed`);
    // QUESTION: Maybe navigation to a results screen, like in facebook and vent?
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
          <Text>Feed Screen!</Text>
          <Animated.View style={[styles.searchViewStyle, { opacity: this.state.opacity }]}>
            <Text>Animated View</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue'
  }
});

export default FeedScreen;
