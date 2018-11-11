import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Animated, StyleSheet, RefreshControl, Text, Dimensions, Keyboard } from 'react-native';

// TODO: Add tab view later
// Connect to redux to handle pagination and refresh
// Fix pagination to only happen when on search results, not search suggestions
// When showing popular search suggestings, have a "search up" clickable at the bottom (like reddit app)
class GeneralSearchScreen extends Component {
  state = {
    refreshing: false,
    canPaginate: false
  }

  componentDidUpdate(prevProps) {
    // Scroll back to top if hidden
    if (this.props.display === 'none' && prevProps.display === 'flex') {
      this.animList.scrollToOffset({ x: 0, y: 0, animated: false });
    }
  }

  handleScroll = () => Keyboard.dismiss()

  handleContentSizeChange = (contentWidth, contentHeight) => {
    this.setState(() => ({
      canPaginate: contentHeight > this.props.height
    }));
  }

  handleRefresh = () => {
    this.setState(() => ({ refreshing: true }));
    // TODO: Grab new data from database again here, and set refreshing to false
    setTimeout(() => this.setState(() => ({ refreshing: false })), 1000);
  }

  handleEndReached = () => {
    // TODO: Handle pagination here
    // If no more old data, then don't do anything anymore
    console.log('search results paginate for more data here');
  };

  renderItem = data => {
    return <Text style={{ alignSelf: 'center' }}>{data.item.text}</Text>;
  }

  render() {
    return (
      <Animated.View
        style={[styles.searchViewStyle, {
          display: this.props.display,
          opacity: this.props.opacity,
          height: this.props.height
        }]}
      >
        <FlatList
          ref={o => (this.animList = o)}
          data={this.props.results}
          renderItem={this.renderItem}
          keyExtractor={data => data.id}
          onScroll={this.handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
          onContentSizeChange={this.handleContentSizeChange}
          onEndReached={this.handleEndReached}
          onEndReachedThreshold={0}
        />
      </Animated.View>
    );
  }
}

GeneralSearchScreen.propTypes = {
  display: PropTypes.string.isRequired,
  opacity: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  results: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  searchViewStyle: {
    backgroundColor: 'blue',
    position: 'absolute',
    width: Dimensions.get('window').width
  }
});

export default GeneralSearchScreen;
