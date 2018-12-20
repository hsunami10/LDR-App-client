import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, Keyboard, RefreshControl } from 'react-native';
import SuggestionCard from './SuggestionCard';
import { NO_USER_SUGGESTIONS_MSG } from '../../../constants/noneMessages';

// NOTE: When refreshing, get "term" from app state
// Disable refreshing when the data is loading
class SuggestionList extends Component {
  renderData = ({ item }) => (
    <SuggestionCard
      suggestion={item}
      onPress={this.props.onPress}
      onRemovePress={this.props.onRemovePress}
    />
  )

  renderMessage = ({ item }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: this.props.height }}>
      <Text>{item.text}</Text>
    </View>
  )

  render() {
    return (
      <FlatList
        data={this.props.data.length === 0 ? [{ id: 'foo', text: `${NO_USER_SUGGESTIONS_MSG} for ${this.props.term}.` }] : this.props.data}
        renderItem={this.props.data.length === 0 ? this.renderMessage : this.renderData}
        keyExtractor={suggestion => suggestion.id}
        refreshControl={
          <RefreshControl
            refreshing={this.props.refreshing}
            onRefresh={this.props.onRefresh}
          />
        }
        onScroll={() => Keyboard.dismiss()}
        onContentSizeChange={this.handleContentSizeChange}
        onEndReached={this.handleEndReached}
        keyboardShouldPersistTaps="always"
        scrollEventThrottle={16}
        onEndReachedThreshold={0}
      />
    );
  }
}

SuggestionList.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPress: PropTypes.func.isRequired,
  onRemovePress: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired, // Only for centering no results message
  term: PropTypes.string.isRequired,
  refreshing: PropTypes.bool.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

export default SuggestionList;
