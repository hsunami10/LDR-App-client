import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import moment from 'moment';
import { MAX_POST_BODY_LINES } from '../../constants/variables';
import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';

// TODO: Finish post cards - to show in feed
const PostCard = ({ index, userID, post, viewProfile, postLikes }) => (
  <View style={styles.viewStyle}>
    <PostCardHeader post={post} viewProfile={viewProfile} userID={userID} />
    <PostCardBody post={post} />
    <PostCardFooter postLikes={postLikes} index={index} post={post} />
  </View>
);

PostCard.propTypes = {
  userID: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
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
