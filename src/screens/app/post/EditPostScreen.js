import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import CreatePostScreen from '../create/CreatePostScreen';
import { goBackwardRoute } from '../../../actions/NavigationActions';
import { stopLoading } from '../../../actions/LoadingActions';
import { editPost } from '../../../actions/PostActions';

// TODO: Handle errors in handleSubmit before submitting
class EditPostScreen extends Component {
  state = {
    post: null,
    error: {
      type: null,
      msg: ' '
    }
  }

  componentDidMount() {
    const post = this.props.navigation.getParam('post', null);
    this.setState(() => ({ post }));
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

  handleSubmit = () => {
    this.props.editPost(
      {
        post: this.state.post,
        type: 'body',
        data: {
          body: this.state.post.body,
          topic: this.props.post_topic
        },
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
            topic={{
              id: this.state.post.topic_id,
              name: this.state.post.name
            }}
            handleChangeBody={this.handleChangeBody}
            error={this.state.error}
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
  loading: PropTypes.bool.isRequired,
  stopLoading: PropTypes.func.isRequired,
  goBackwardRoute: PropTypes.func.isRequired,
  current_route: PropTypes.string.isRequired,
  editPost: PropTypes.func.isRequired,
  post_topic: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  loading: state.loading,
  current_route: state.navigation.current_route,
  post_topic: state.topics.post_topic
});

export default connect(mapStateToProps, {
  stopLoading,
  goBackwardRoute,
  editPost
})(EditPostScreen);
