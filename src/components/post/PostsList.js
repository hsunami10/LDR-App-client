import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

// type: 'user', 'feed', 'discover'
// QUESTION: Do I need this? Why not just keep it in the local state?
class PostsList extends Component {
  render() {
    return <View />;
  }
}

PostsList.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired
};

export default PostsList;
