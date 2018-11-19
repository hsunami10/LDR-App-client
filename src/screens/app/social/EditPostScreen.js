import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import CreatePostScreen from '../create/CreatePostScreen';
import { goBackwardRoute } from '../../../actions/NavigationActions';
import { stopLoading } from '../../../actions/LoadingActions';
import { editPost } from '../../../actions/PostActions';

// QUESTION: How to get the current user's alias - index in alias array?
class EditPostScreen extends Component {
  state = {
    post: null,
    initIndex: -1,
    error: {
      type: null,
      msg: ' '
    }
  }

  componentDidMount() {
    let aliasID = '';
    let alias = '';
    let index = -1;
    const post = this.props.navigation.getParam('post', null);

    // Find the index of the alias of the original post in aliases array - to set AliasPicker initial value
    if (post.alias_id === '') {
      this.setState(() => ({ post }));
    } else {
      for (let i = 0, len = this.props.aliases.length; i < len; i++) {
        if (this.props.aliases[i].id === post.alias_id) {
          aliasID = post.alias_id;
          alias = post.alias;
          index = i;
          break;
        }
      }
      this.setState(() => ({
        post: {
          ...post,
          alias_id: aliasID,
          alias
        },
        initIndex: index
      }));
    }
  }

  componentWillUnmount() {
    if (this.props.current_route === 'EditPost') {
      this.props.goBackwardRoute();

      if (this.props.loading) { // Stop loading if the user cancels transaction
        this.props.stopLoading();
      }
    }
  }

  handleLeftPress = () => this.props.navigation.pop()
  handleChangeBody = body => this.setState(prevState => ({ post: { ...prevState.post, body } }))
  handleAliasChange = index => {
    this.setState(prevState => ({
      post: {
        ...prevState.post,
        alias_id: index < 0 ? '' : this.props.aliases[index].id,
        alias: index < 0 ? '' : this.props.aliases[index].alias
      },
      initIndex: index
    }));
  }

  handleSubmit = () => {
    this.props.editPost(
      {
        post: this.state.post,
        type: 'body',
        data: this.state.post.body,
        userID: this.props.id
      },
      this.props.navigation
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StandardHeader
          title="Edit Post"
          showLeft
          onLeftPress={this.handleLeftPress}
          showRight
          rightTitle="Save"
          disableRight={this.props.loading}
          onRightPress={this.handleSubmit}
        />
        {this.state.post ?
          <CreatePostScreen
            body={this.state.post.body}
            topic={this.state.post.name}
            handleChangeBody={this.handleChangeBody}
            handleAliasChange={this.handleAliasChange}
            aliases={this.props.aliases}
            error={this.state.error}
            selectedAlias={this.state.initIndex}
            navigation={this.props.navigation}
          /> :
        null}
        <FullScreenLoading loading={this.props.loading || !this.state.post} allowTouchThrough />
      </View>
    );
  }
}

EditPostScreen.propTypes = {
  id: PropTypes.string.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  stopLoading: PropTypes.func.isRequired,
  goBackwardRoute: PropTypes.func.isRequired,
  current_route: PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  aliases: state.user.aliases,
  loading: state.loading,
  current_route: state.navigation.current_route
});

export default connect(mapStateToProps, {
  stopLoading,
  goBackwardRoute,
  editPost
})(EditPostScreen);
