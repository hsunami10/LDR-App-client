import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Keyboard } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { popRoute } from '../../../actions/NavigationActions';
import { StandardHeader } from '../../../components/common';
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
    topic: 'Choose Topic',
    body: '',
    name: '',
    description: '',

    postError: {
      type: null,
      msg: ' '
    },
    topicError: {
      type: null,
      msg: ' '
    }
  }

  componentWillUnmount() {
    if (this.props.current_route === 'Create') {
      this.props.popRoute(this.props.routes[this.props.routes.length - 2]);
    }
  }

  handleIndexChange = index => {
    this.setState((prevState) => {
      return {
        navigationState: { ...prevState.navigationState, index }
      };
    });
  }

  handleChangeBody = body => this.setState(() => ({ body }))
  handleChangeName = name => this.setState(() => ({ name }))
  handleChangeDescription = description => this.setState(() => ({ description }))

  handleSubmit = () => {
    if (this.state.navigationState.index === 0) {
      if (this.state.body.trim() === '') {
        this.setState(() => ({
          postError: {
            type: 'body',
            msg: 'A body is required to create a post'
          }
        }));
      } else {
        this.setState(() => ({
          postErrorMsg: {
            type: null,
            msg: ' '
          }
        }));
        console.log(`create post with topic: ${this.state.topic} and body: ${this.state.body}`);
        this.props.navigation.navigate('Main');
      }
    } else if (this.state.name.trim() === '') {
      this.setState(() => ({
        topicError: {
          type: 'name',
          msg: 'A topic name is required to create a topic'
        }
      }));
    } else if (this.state.description.trim() === '') {
      this.setState(() => ({
        topicError: {
          type: 'description',
          msg: 'A topic description is required to create a topic'
        }
      }));
    } else {
      this.setState(() => ({
        topicError: {
          type: null,
          msg: ' '
        }
      }));
      console.log(`create topic with name: ${this.state.name} and description: ${this.state.description}`);
      this.props.navigation.navigate('Main');
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'post':
        return (
          <CreatePostScreen
            navigation={this.props.navigation}
            handleChangeBody={this.handleChangeBody}
            topic={this.state.topic}
            body={this.state.body}
            error={this.state.postError}
          />
        );
      case 'topic':
        return (
          <CreateTopicScreen
            handleChangeName={this.handleChangeName}
            handleChangeDescription={this.handleChangeDescription}
            name={this.state.name}
            description={this.state.description}
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
              rightTitle={this.state.navigationState.index === 0 ? 'Post' : 'Request'}
              onRightPress={this.handleSubmit}
              showLeft
              onLeftPress={() => this.props.navigation.goBack()}
              tabTitleWidth={200}
            />
          }
          onIndexChange={this.handleIndexChange}
          useNativeDriver
        />
      </View>
    );
  }
}

CreateMainScreen.propTypes = {
  current_route: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  popRoute: PropTypes.func.isRequired
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
  current_route: state.navigation.current_route,
  routes: state.navigation.routes
});

export default connect(mapStateToProps, { popRoute })(CreateMainScreen);
