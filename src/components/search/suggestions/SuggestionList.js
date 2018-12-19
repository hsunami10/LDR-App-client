import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, Keyboard } from 'react-native';
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
        data={this.props.data.length === 0 ? [{ id: 'foo', text: NO_USER_SUGGESTIONS_MSG }] : this.props.data}
        renderItem={this.props.data.length === 0 ? this.renderMessage : this.renderData}
        keyExtractor={suggestion => suggestion.id}
        onScroll={() => Keyboard.dismiss()}
        onContentSizeChange={this.handleContentSizeChange}
        onEndReached={this.handleEndReached}
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
};

export default SuggestionList;
