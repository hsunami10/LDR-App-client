import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';

// TODO: Finish post cards - to show in feed
// Handle clicking on post cards
const PostCard = ({ userID, post, viewProfile, postLikes, navigation, parentNavigation }) => (
  <TouchableHighlight
    onPress={() => {
      // TODO: Finish navigating - update app state if needed
      console.log('TODO: update app state if needed for navigating to ViewPostScreen');
      parentNavigation.push('ViewPost', { post });
    }}
    underlayColor="rgba(0,0,0,0.4)"
  >
    <View style={styles.viewStyle}>
      <PostCardHeader post={post} viewProfile={viewProfile} userID={userID} />
      <PostCardBody post={post} />
      <PostCardFooter post={post} postLikes={postLikes} navigation={navigation} parentNavigation={parentNavigation} />
    </View>
  </TouchableHighlight>
);

PostCard.propTypes = {
  userID: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired,
  postLikes: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired
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
