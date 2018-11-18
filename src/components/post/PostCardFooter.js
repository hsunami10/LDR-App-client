import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Platform, Text } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { editPost, deletePost } from '../../actions/PostActions';
import { navigateToRoute } from '../../actions/NavigationActions';
import { fetchAliases } from '../../actions/UserActions';

class PostCardFooter extends Component {
  state = { flag: false } // Force re-render to see updated post

  handleCommentAction = () => {
    console.log('go to post comments of post id ' + this.props.post.id);
  }

  handleLikeAction = () => {
    this.props.editPost({
      post: this.props.post,
      type: 'num_likes',
      data: this.props.postLikes[this.props.post.id] ? this.props.post.num_likes - 1 : this.props.post.num_likes + 1,
      userID: this.props.id
    });
    this.setState(prevState => ({ flag: !prevState.flag }));
  }

  handleOwnActions = index => {
    switch (index) {
      case 0:
        if (this.props.alias_fetched) {
          this.props.navigateToRoute('EditPost');
          this.props.parentNavigation.navigate('EditPost', { post: this.props.post });
        } else {
          this.props.fetchAliases(this.props.id, this.props.parentNavigation, 'EditPost', { post: this.props.post });
        }
        break;
      case 1:
        this.props.deletePost(this.props.id, this.props.post.id);
        break;
      default:
        return;
    }
  }

  handleOtherActions = index => {
    switch (index) {
      case 0:
        console.log('report post');
        break;
      default:
        return;
    }
  }

  onPressAction = index => {
    if (this.props.id === this.props.post.author_id) {
      this.handleOwnActions(index);
    } else {
      this.handleOtherActions(index);
    }
  }

  showActionSheet = () => this.ActionSheet.show();
  ref = o => (this.ActionSheet = o)

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
        <Ionicons onPress={this.showActionSheet} style={{ marginLeft: 'auto', marginRight: 10 }} name={`${Platform.OS}-more`} size={35} color="gray" />
        <ActionSheet
          ref={this.ref}
          options={this.props.id === this.props.post.author_id ? ['Edit', 'Delete', 'Cancel'] : ['Report', 'Cancel']}
          cancelButtonIndex={this.props.id === this.props.post.author_id ? 2 : null}
          destructiveButtonIndex={this.props.id === this.props.post.author_id ? 1 : null}
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
  postLikes: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  alias_fetched: PropTypes.bool.isRequired,
  navigation: PropTypes.object.isRequired,
  navigateToRoute: PropTypes.func.isRequired,
  fetchAliases: PropTypes.func.isRequired,
  parentNavigation: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  alias_fetched: state.user.alias_fetched
});

export default connect(mapStateToProps, {
  editPost,
  deletePost,
  navigateToRoute,
  fetchAliases
})(PostCardFooter);
