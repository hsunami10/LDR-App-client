import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

/*
type: 'user', 'feed', 'discover' to differentiate between which part of the app state to update
Keep a copy in the local state
Won't work if there are multiple of the same PostsList (ex. multiple user posts in ViewProfileScreen)
 */
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
