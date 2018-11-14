import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { MAX_POST_BODY_LINES } from '../../constants/variables';

const PostCardBody = ({ post }) => (
  <View style={styles.viewStyle}>
    <Text>
      {/* TODO: Find number of lines, truncate according to those lines
        Add a "more" button if truncated, to show the whole post */}
      {post.body}
    </Text>

    <View />
  </View>
);

PostCardBody.propTypes = {
  post: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
    margin: 5
  },
});

export default PostCardBody;
