import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import moment from 'moment';
import { ROOT_URL, MAX_POST_BODY_LINES } from '../../constants/variables';
import { ClickableImage } from '../../components/common';
import PostCardFooter from './PostCardFooter';

// TODO: Finish post cards - to show in feed
const PostCard = ({ index, userID, post, viewProfile, postLikes }) => (
  <View style={styles.viewStyle}>
    <View style={styles.postHeaderStyle}>
      <ClickableImage
        style={{ marginLeft: 10 }}
        width={40}
        height={40}
        type="none"
        onPress={() => viewProfile(post.author_id)}
        image={post.profile_pic ? `${ROOT_URL}/${post.profile_pic}` : null}
      />
      <View style={{ marginLeft: 10 }}>
        <Text
          style={{ fontWeight: 'bold' }}
          onPress={() => viewProfile(post.author_id)}
        >
          {/* Only show the real username if there's an alias OR if you're the author */}
          {(post.alias_id === '' || post.author_id === userID) ? post.username : post.alias}
        </Text>
        <Text style={{ fontSize: 12 }}>{post.topic_id === '' ? 'Global' : post.name}</Text>
      </View>
      <View style={{ marginLeft: 'auto', marginRight: 10 }}>
        <Text>{`${moment(moment.unix(parseInt(post.date_posted, 10))).fromNow(true)} ago`}</Text>
      </View>
    </View>

    <View style={{ flex: 1, justifyContent: 'center', padding: 5, margin: 5 }}>
      <Text>
        {/* TODO: Find number of lines, truncate according to those lines */}
        {post.body}
      </Text>
    </View>

    <View>
      {/* TODO: Find number of lines, show if greater than max lines */}
    </View>

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
  },
  postHeaderStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginTop: 10
  }
});

export default PostCard;
