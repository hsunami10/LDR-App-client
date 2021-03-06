import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { goBackwardRoute } from '../../../actions/NavigationActions';
import { createPost } from '../../../actions/PostActions';
import { createTopic } from '../../../actions/TopicActions';
import { stopLoading } from '../../../actions/LoadingActions';
import { StandardHeader, FullScreenLoading } from '../../../components/common';
import { isValidName, hasTrailingSpaces } from '../../../assets/helpers/text';
import CreatePostScreen from './CreatePostScreen';
import CreateTopicScreen from './CreateTopicScreen';

class CreateMainScreen extends Component {
  state = {
    navigationState: {
      index: 0,
      routes: [
        { key: 'post', title: 'Post' },
        { key: 'topic', title: 'Topic' }
      ]
    },

    // Create Post
    body: '',
    postError: {
      type: null,
      msg: ' '
    },

    // Create Topic
    name: '',
    description: '',
    image: null,
    topicError: {
      type: null,
      msg: ' '
    }
  }

  componentWillUnmount() {
    if (this.props.current_route === 'Create') {
      this.props.goBackwardRoute();

      if (this.props.loading) { // Stop loading if the user cancels transaction
        this.props.stopLoading();
      }
    }
  }

  handleIndexChange = index => {
    Keyboard.dismiss();
    this.setState((prevState) => {
      return {
        navigationState: { ...prevState.navigationState, index }
      };
    });
  }

  handleChangeBody = body => this.setState(() => ({ body }))
  handleChangeName = name => this.setState(() => ({ name }))
  handleChangeDescription = description => this.setState(() => ({ description }))
  handleChangeImage = image => this.setState(() => ({ image }));

  handleSubmit = () => {
    Keyboard.dismiss();
    if (this.state.navigationState.index === 0) {
      if (this.props.post_topic.id === '') {
        this.handlePostError('topic');
      } else if (this.state.body.trim() === '') {
        this.handlePostError('body');
      } else {
        this.handlePostError(null);
        this.props.createPost({
          user_id: this.props.id,
          topic_id: this.props.post_topic.id,
          body: this.state.body,
          coordinates: this.props.user.coordinates
        }, this.props.navigation);
      }
    } else if (!isValidName(this.state.name)) {
      this.handleTopicError('name');
    } else if (!isValidName(this.state.description)) {
      this.handleTopicError('description');
    } else if (!this.state.image) {
      this.handleTopicError('image');
    } else {
      this.handleTopicError(null);
      this.props.createTopic({
        user_id: this.props.id,
        name: this.state.name,
        description: this.state.description,
        clientImage: this.state.image
      },
      this.props.navigation,
      this.createTopicErrCb
    );
    }
  }

  handlePostError = type => {
    let msg = ' ';
    switch (type) {
      case 'topic':
        msg = 'A topic is required to create a post';
        break;
      case 'body':
        msg = 'A body is required to create a post';
        break;
      default:
        break;
    }
    this.setState(() => ({ postError: { type, msg } }));
  }

  handleTopicError = type => {
    let msg = ' ';
    switch (type) {
      case 'name':
        msg = 'A topic name is required to create a topic';
        break;
      case 'description':
        msg = 'A topic description is required to create a topic';
        break;
      case 'image':
        msg = 'An image is required to create a topic';
        break;
      default:
        break;
    }
    if (hasTrailingSpaces([this.state.name, this.state.description])) {
      msg = 'No trailing spaces';
    }
    this.setState(() => ({ topicError: { type, msg } }));
  }

  createTopicErrCb = msg => this.setState(() => ({ topicError: { type: null, msg } }))

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'post':
        return (
          <CreatePostScreen
            navigation={this.props.navigation}
            handleChangeBody={this.handleChangeBody}
            topic={{ // NOTE: Make sure it's the same as the default topic in app state - state.topics.post_topic
              id: '',
              name: 'Choose a Topic'
            }}
            body={this.state.body}
            error={this.state.postError}
          />
        );
      case 'topic':
        return (
          <CreateTopicScreen
            handleChangeName={this.handleChangeName}
            handleChangeDescription={this.handleChangeDescription}
            handleChangeImage={this.handleChangeImage}
            name={this.state.name}
            description={this.state.description}
            image={this.state.image}
            error={this.state.topicError}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={this.state.navigationState}
          renderScene={this.renderScene}
          renderTabBar={props =>
            <StandardHeader
              title={
                <TabBar // TODO: Customize this later
                  {...props}
                  layout={{
                    ...props.layout,
                    width: 200
                  }}
                  useNativeDriver
                  style={styles.tabBarStyle}
                  indicatorStyle={styles.indicatorStyle}
                />
              }
              height={100}
              showRight
              rightTitle={this.state.navigationState.index === 0 ? 'Post' : 'Create'}
              onRightPress={this.handleSubmit}
              disableRight={this.props.loading}
              showLeft
              onLeftPress={() => this.props.navigation.pop()}
              tabTitleWidth={200}
            />
          }
          onIndexChange={this.handleIndexChange}
          useNativeDriver
        />
        <FullScreenLoading loading={this.props.loading} allowTouchThrough />
      </View>
    );
  }
}

CreateMainScreen.propTypes = {
  id: PropTypes.string.isRequired,
  current_route: PropTypes.string.isRequired,
  goBackwardRoute: PropTypes.func.isRequired,
  createTopic: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  stopLoading: PropTypes.func.isRequired,
  createPost: PropTypes.func.isRequired,
  post_topic: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  tabBarStyle: {
    width: 200,
    alignSelf: 'center'
  },
  indicatorStyle: {
    width: 100,
    alignSelf: 'center'
  }
});

const mapStateToProps = state => ({
  id: state.auth.id,
  user: state.user,
  current_route: state.navigation.current_route,
  loading: state.loading,
  post_topic: state.topics.post_topic
});

export default connect(mapStateToProps, {
  goBackwardRoute,
  createPost,
  createTopic,
  stopLoading
})(CreateMainScreen);
