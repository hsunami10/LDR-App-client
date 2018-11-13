import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { View, Text, StyleSheet } from 'react-native';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage } from '../../components/common';

const PostCardHeader = ({ post, viewProfile, userID }) => (
  <View style={styles.viewStyle}>
    <ClickableImage
      style={{ marginLeft: 10 }}
      width={40}
      height={40}
      type="none"
      onPress={() => viewProfile(post.author_id)}
      image={post.profile_pic ? `${ROOT_URL}/${post.profile_pic}` : null}
    />
    <View style={styles.middleStyle}>
      <Text
        style={{ fontWeight: 'bold' }}
        onPress={() => viewProfile(post.author_id)}
      >
        {/* Only show the real username if there's an alias OR if you're the author */}
        {(post.alias_id === '' || post.author_id === userID) ? post.username : post.alias}
      </Text>
      <Text style={{ fontSize: 12 }}>{post.name}</Text>
    </View>
    <View style={styles.dateStyle}>
      <Text>{`${moment(moment.unix(parseInt(post.date_posted, 10))).fromNow(true)} ago`}</Text>
    </View>
  </View>
);

PostCardHeader.propTypes = {
  post: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired,
  userID: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginTop: 10
  },
  middleStyle: {
    marginLeft: 10
  },
  dateStyle: {
    marginLeft: 'auto',
    marginRight: 10
  }
});

export default PostCardHeader;
