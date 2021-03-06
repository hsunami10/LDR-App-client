import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Platform, Text } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { editPost, deletePost } from '../../actions/PostActions';
import { navigateToRoute } from '../../actions/NavigationActions';

class PostCardFooter extends Component {
  state = { flag: false } // Force re-render to see updated post

  onPressAction = index => {
    if (this.props.id === this.props.post.author_id) {
      this.handleOwnActions(index);
    } else {
      this.handleOtherActions(index);
    }
  }

  showActionSheet = () => this.ActionSheet.show();
  ref = o => (this.ActionSheet = o)

  handleCommentAction = () => {
    if (this.props.viewing) {
      console.log('open keyboard to create comment');
    } else {
      this.props.viewPost(this.props.post);
    }
  }

  handleLikeAction = () => {
    this.props.editPost(
      {
        post: this.props.post,
        type: 'num_likes',
        data: this.props.post_likes[this.props.post.id] ? parseInt(this.props.post.num_likes, 10) - 1 : parseInt(this.props.post.num_likes, 10) + 1,
        userID: this.props.id
      },
      this.props.viewing ? this.props.navigation : null
    );
    this.setState(prevState => ({ flag: !prevState.flag }));
  }

  handleOwnActions = index => {
    switch (index) {
      case 0:
        this.props.navigateToRoute('EditPost');
        this.props.parentNavigation.navigate('EditPost', { post: this.props.post });
        break;
      case 1:
        this.props.deletePost(this.props.id, this.props.post.id, this.props.navigation);
        break;
      default:
        return;
    }
  }

  handleOtherActions = index => {
    switch (index) {
      case 0:
        console.log('report post with parentNavigation');
        break;
      default:
        return;
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 1, height: 40, alignItems: 'center' }}>
        <Text
          style={{ marginLeft: 10, backgroundColor: (this.props.post_likes[this.props.post.id] ? 'gray' : 'transparent') }}
          onPress={this.handleLikeAction}
        >
          {/*TODO: Do heart buttom for interaction / liking later - FIX DESIGN*/}
          {`${this.props.post.num_likes} Likes`}
        </Text>
        <View style={{ height: 40, marginLeft: 10, marginRight: 10, borderColor: 'white', borderWidth: 1 }} />
        <Text onPress={this.handleCommentAction}>
          Comment ({this.props.post.num_comments})
        </Text>
        <Ionicons onPress={this.showActionSheet} style={{ marginLeft: 'auto', marginRight: 10 }} name={`${Platform.OS}-more`} size={35} color="gray" />
        <ActionSheet
          ref={this.ref}
          options={this.props.id === this.props.post.author_id ? ['Edit', 'Delete', 'Cancel'] : ['Report', 'Cancel']}
          cancelButtonIndex={this.props.id === this.props.post.author_id ? 2 : 1}
          destructiveButtonIndex={this.props.id === this.props.post.author_id ? 1 : undefined}
          onPress={this.onPressAction}
        />
      </View>
    );
  }
}

PostCardFooter.propTypes = {
  id: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  editPost: PropTypes.func.isRequired,
  post_likes: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  viewPost: PropTypes.func,
  navigateToRoute: PropTypes.func.isRequired,
  navigation: PropTypes.object,
  parentNavigation: PropTypes.object.isRequired,
  viewing: PropTypes.bool
};

const mapStateToProps = state => ({
  id: state.auth.id,
  post_likes: state.posts.post_likes
});

export default connect(mapStateToProps, {
  editPost,
  deletePost,
  navigateToRoute
})(PostCardFooter);
