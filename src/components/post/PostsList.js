import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

class PostsList extends Component {
  render() {
    return <View />;
  }
}

PostsList.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  post_likes: PropTypes.object.isRequired
};

export default PostsList;
