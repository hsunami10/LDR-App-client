import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';

// TODO: Finish post cards - to show in feed
// Handle clicking on post cards
const PostCard = ({ userID, post, viewProfile, postLikes }) => (
  <View style={styles.viewStyle}>
    <PostCardHeader post={post} viewProfile={viewProfile} userID={userID} />
    <PostCardBody post={post} />
    <PostCardFooter post={post} postLikes={postLikes} />
  </View>
);

PostCard.propTypes = {
  userID: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired,
  postLikes: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    // height: 125,
    borderColor: '#C1C7C9',
    borderTopWidth: 1,
    borderBottomWidth: 1
  }
});

export default PostCard;
