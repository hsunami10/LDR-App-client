import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Platform, Text } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchAliases } from '../../actions/UserActions';

class CommentCardFooter extends Component {
  state = { flag: false } // Force re-render to see updated post

  onPressAction = index => {
    if (this.props.id === this.props.comment.author_id) {
      this.handleOwnActions(index);
    } else {
      this.handleOtherActions(index);
    }
  }

  showActionSheet = () => this.ActionSheet.show();
  ref = o => (this.ActionSheet = o)

  handleLikeAction = () => {
    console.log('like comment');
    // this.props.editPost({
    //   post: this.props.post,
    //   type: 'num_likes',
    //   data: this.props.postLikes[this.props.post.id] ? parseInt(this.props.post.num_likes, 10) - 1 : parseInt(this.props.post.num_likes, 10) + 1,
    //   userID: this.props.id
    // });
    this.setState(prevState => ({ flag: !prevState.flag }));
  }

  handleOwnActions = index => {
    switch (index) {
      case 0:
        console.log('edit comment');
        break;
      case 1:
        console.log('delete comment');
        // this.props.deletePost(this.props.id, this.props.comment.id, this.props.navigation);
        break;
      default:
        return;
    }
  }

  handleOtherActions = index => {
    switch (index) {
      case 0:
        console.log('report post using parentNavigation');
        break;
      default:
        return;
    }
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', borderColor: 'white', borderWidth: 1, height: 40, alignItems: 'center' }}>
        <Text
          style={{ marginLeft: 10, backgroundColor: (this.props.comment_likes[this.props.comment.id] ? 'gray' : 'transparent') }}
          onPress={this.handleLikeAction}
        >
          {/*TODO: Do heart buttom for interaction / liking later - FIX DESIGN*/}
          {`${this.props.comment.num_likes} Likes`}
        </Text>
        <Ionicons onPress={this.showActionSheet} style={{ marginLeft: 'auto', marginRight: 10 }} name={`${Platform.OS}-more`} size={35} color="gray" />
        <ActionSheet
          ref={this.ref}
          options={this.props.id === this.props.comment.author_id ? ['Edit', 'Delete', 'Cancel'] : ['Report', 'Cancel']}
          cancelButtonIndex={this.props.id === this.props.comment.author_id ? 2 : null}
          destructiveButtonIndex={this.props.id === this.props.comment.author_id ? 1 : null}
          onPress={this.onPressAction}
        />
      </View>
    );
  }
}

CommentCardFooter.propTypes = {
  id: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  comment_likes: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  comment_likes: state.comments.comment_likes
});

export default connect(mapStateToProps, {
  fetchAliases
})(CommentCardFooter);
