import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Platform, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { editPost } from '../../actions/PostActions';

class PostCardFooter extends Component {
  state = { flag: false } // Force re-render to see updated post

  handleCommentAction = () => {
    console.log('go to post comments of post id ' + this.props.post.id);
  }

  handleLikeAction = () => {
    this.props.editPost({
      index: this.props.index,
      post: this.props.post,
      type: 'num_likes',
      data: this.props.postLikes[this.props.post.id] ? this.props.post.num_likes - 1 : this.props.post.num_likes + 1,
      userID: this.props.id
    });
    this.setState(prevState => ({ flag: !prevState.flag }));
  }

  handleOptionsAction = () => {
    console.log('handle post actions of post id ' + this.props.post.id);
    if (this.props.id === this.props.post.author_id) {
      console.log('show options to edit post body and delete post');
    } else {
      console.log('show options to block / report')
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 1, height: 40, alignItems: 'center' }}>
        <Text
          style={{ marginLeft: 10, backgroundColor: (this.props.postLikes[this.props.post.id] ? 'gray' : 'transparent') }}
          onPress={this.handleLikeAction}
        >
          {/*TODO: Do heart buttom for interaction / liking later - FIX DESIGN*/}
          {`${this.props.post.num_likes} Likes`}
        </Text>
        <View style={{ height: 40, marginLeft: 10, marginRight: 10, borderColor: 'white', borderWidth: 1 }} />
        <Text onPress={this.handleCommentAction}>
          Comment
        </Text>
        <Ionicons onPress={this.handleOptionsAction} style={{ marginLeft: 'auto', marginRight: 10 }} name={`${Platform.OS}-more`} size={35} color="gray" />
      </View>
    );
  }
}

PostCardFooter.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  post: PropTypes.object.isRequired,
  editPost: PropTypes.func.isRequired,
  postLikes: PropTypes.object.isRequired // Depends on -
};

const mapStateToProps = state => ({ id: state.auth.id });

export default connect(mapStateToProps, { editPost })(PostCardFooter);
