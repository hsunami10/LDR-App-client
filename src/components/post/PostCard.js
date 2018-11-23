import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import PostCardHeader from './PostCardHeader';
import PostCardBody from './PostCardBody';
import PostCardFooter from './PostCardFooter';

const PostCard = ({ userID, post, viewProfile, viewPost, navigation, parentNavigation, viewing, onLayout }) => (
  <TouchableHighlight
    onLayout={onLayout}
    onPress={() => viewPost(post)}
    disabled={viewing}
    underlayColor="rgba(0,0,0,0.3)"
  >
    <View style={styles.viewStyle}>
      <PostCardHeader
        post={post}
        viewProfile={viewProfile}
        userID={userID}
      />
      <PostCardBody
        viewing={viewing}
        post={post}
        viewPost={viewPost}
      />
      <PostCardFooter
        viewing={viewing}
        post={post}
        viewPost={viewPost}
        navigation={navigation}
        parentNavigation={parentNavigation}
      />
    </View>
  </TouchableHighlight>
);

PostCard.propTypes = {
  userID: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired,
  viewPost: PropTypes.func,
  navigation: PropTypes.object, // Only not null if in ViewPostScreen
  parentNavigation: PropTypes.object.isRequired,
  viewing: PropTypes.bool,
  onLayout: PropTypes.func
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
