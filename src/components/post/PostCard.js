import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage } from '../../components/common';

// TODO: Finish post cards - to show in feed
const PostCard = ({ post, viewProfile }) => (
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
          {post.username}
        </Text>
        <Text style={{ fontSize: 12 }}>{post.topic_id === '' ? 'Global' : post.name}</Text>
      </View>
      <View style={{ marginLeft: 'auto', marginRight: 10 }}>
        <Text>{`${moment(moment.unix(parseInt(post.date_posted, 10))).fromNow(true)} ago`}</Text>
      </View>
    </View>

    <View style={{ flex: 1, justifyContent: 'center', padding: 5 }}>
      <Text>{post.body}</Text>
    </View>

    <View>

    </View>

    <View style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 1, height: 40, alignItems: 'center' }}>
      <Text
        style={{ marginLeft: 10 }}
        onPress={() => console.log('increase num_likes of post id: ' + post.id)}
      >
        {/*TODO: Do heart buttom for interaction / liking later - FIX DESIGN*/}
        {`${post.num_likes} Likes`}
      </Text>
      <View style={{ height: 40, marginLeft: 10, marginRight: 10, borderColor: 'white', borderWidth: 1 }} />
      <Text onPress={() => console.log('go to comments at post id: ' + post.id)}>
        Comment
      </Text>
      <Ionicons onPress={() => console.log('handle post actions for post id: ' + post.id)} style={{ marginLeft: 'auto', marginRight: 10 }} name={`${Platform.OS}-more`} size={35} color="gray" />
    </View>
  </View>
);

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    height: 125,
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
