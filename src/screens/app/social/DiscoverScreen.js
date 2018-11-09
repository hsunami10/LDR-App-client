import React, { Component } from 'react';
import shortid from 'shortid';
import { View, Text, Animated, Keyboard, RefreshControl, FlatList } from 'react-native';
import { SearchHeader } from '../../../components/common';
import GeneralSearchScreen from '../GeneralSearchScreen';

// TODO: Have 3 tabs and 3 screens automatically - Users, Posts, Topics - default to middle "Posts"
// When search is clicked, show animated view with top 10 popular search terms of all time (grabbed from database)
// When the user starts typing, show the top 5 popular search terms of all for the keyword OR trending searches today (top 5 searches made today)
// When the user clicks enter or scrolls, then search up data in database

class DiscoverScreen extends Component {
  state = {
    refreshing: false,
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
    ]
  }

  componentDidMount() {
    console.log('grab discover feed here with api endpoint');
  }

  handleEndReached = () => {
    // TODO: Handle pagination here
    // If no more old data, then don't do anything anymore
    console.log('discover paginate for more data here');
  };

  handleRefresh = () => {
    this.setState(() => ({ refreshing: true }));
    // TODO: Grab new data from database again here, and set refreshing to false
    setTimeout(() => this.setState(() => ({ refreshing: false })), 1000);
  }

  renderItem = data => {
    return <Text style={{ alignSelf: 'center' }}>{data.item.text}</Text>;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
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
          onEndReached={this.handleEndReached} // TODO: Paginate here
          onEndReachedThreshold={0}
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
            onEndReached={this.handleEndReached} // TODO: Paginate here
            onEndReachedThreshold={0}
          />
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

export default DiscoverScreen;
