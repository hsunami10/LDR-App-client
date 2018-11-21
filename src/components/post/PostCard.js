import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';

// TODO: Finish post cards - to show in feed
// Handle clicking on post cards
const PostCard = ({ userID, post, viewProfile, viewPost, parentNavigation, viewing }) => (
  <TouchableHighlight
    onPress={() => viewPost(post)}
    disabled={viewing}
    underlayColor="rgba(0,0,0,0.4)"
  >
    <View style={styles.viewStyle}>
      <PostCardHeader post={post} viewProfile={viewProfile} userID={userID} />
      <PostCardBody viewing={viewing} post={post} viewPost={viewPost} />
      <PostCardFooter viewing={viewing} post={post} viewPost={viewPost} parentNavigation={parentNavigation} />
    </View>
  </TouchableHighlight>
);

PostCard.propTypes = {
  userID: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired,
  viewPost: PropTypes.func,
  parentNavigation: PropTypes.object.isRequired,
  viewing: PropTypes.bool
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    borderColor: '#C1C7C9',
    borderTopWidth: 1,
    borderBottomWidth: 1
  }
});

export default PostCard;
