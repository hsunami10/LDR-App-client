import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Animated, Keyboard, Dimensions, RefreshControl, ScrollView } from 'react-native';
import { SearchHeader } from '../../../components/common';
import { SEARCH_HEADER_HEIGHT } from '../../../constants/variables';

class DiscoverScreen extends Component {
  state = {
    search: '',
    opacity: new Animated.Value(0),
    refreshing: false
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

  handleChangeText = search => this.setState(() => ({ search }))

  handleSubmitEditing = () => {
    Keyboard.dismiss();
    console.log(`search up: ${this.state.search} in feed`);
    // QUESTION: Maybe navigation to a results screen, like in facebook and vent?
    // TODO: Figure out how to query database
  }

  handleRefresh = () => {
    this.setState(() => ({ refreshing: true }));
    // TODO: Grab new data from database again here, and set refreshing to false
    setTimeout(() => this.setState(() => ({ refreshing: false })), 1000);
  }

  handleScroll = () => Keyboard.dismiss()

  /*
  refreshControl={
    <RefreshControl
      refreshing={this.state.refreshing}
      onRefresh={this.handleRefresh}
    />
  }
  TODO Implement refresh control on non-animated scroll view once bug is figured out
   */

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader
          placeholder="Search Discover..."
          value={this.state.search}
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing}
          onFocus={this.handleSearchFocus}
          onCancelPress={this.handleCancelPress}
          animationDuration={200}
        />
        <View style={styles.centerItems}>
          {/*BUG TODO NOTE QUESTION: Second scroll view does not work?*/}
          <View>
            <Text>Discover Screen!</Text>
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

export default DiscoverScreen;
