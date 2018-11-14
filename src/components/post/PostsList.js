import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

/*
type: 'user', 'feed', 'discover' to differentiate between which part of the app state to update
Keep a copy in the local state
Won't work if there are multiple of the same PostsList (ex. multiple user posts in ViewProfileScreen)

TODO: Decide how to update what
  - num_likes
  - editing body
  - deleting posts
  - creating posts

TODO: Decide how to store
  - store in local state
  - or app state
  - or both?

5 types:
  1) own user posts (posts only by yourself)
  2) other user posts (posts by only one other user)
  3) feed posts (posts for a user's feed)
  4) discover posts (posts in discover)
  5) general search posts (posts resulting from searching)

Remember - there is only 1 feed posts and discover posts at a time

But there can be multiple general search posts and user posts
For general search - have one reducer with 2 separate arrays for data - feed_search_posts, discover_search_posts

NOTE: Every time a post is updated (changing body, liking) or deleted, dispatch to all reducers to update those states
Save the post_id that was updated in the state, and the action that was taken to update it
Other screens can see this change, and will look in their local state to update it there

NOTE: Adding posts should ONLY UPDATE your OWN user profile posts
TODO: Figure out how to handling rerendering / updating ViewProfileScreen when posts array is changed
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
