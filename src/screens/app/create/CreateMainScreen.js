import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, Animated, Keyboard } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { replaceCurrentRoute } from '../../../actions/NavigationActions';
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
    }
  }

  handleIndexChange = index => {
    this.setState((prevState) => {
      this.props.replaceCurrentRoute(prevState.navigationState.routes[index].key);
      return {
        navigationState: { ...prevState.navigationState, index }
      };
    });
  }

  handleScroll = () => {
    Keyboard.dismiss();
  }

  renderSubScene = key => {
    switch (key) {
      case 'post':
        return <CreatePostScreen navigation={this.props.navigation} />;
      case 'topic':
        return <CreateTopicScreen navigation={this.props.navigation} />;
      default:
        return null;
    }
  }

  renderScene = ({ route }) => {
    return (
      <Animated.ScrollView
        onScroll={this.handleScroll}
        scrollEventThrottle={16}
      >
        {this.renderSubScene(route.key)}
      </Animated.ScrollView>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={this.state.navigationState}
          renderScene={this.renderScene}
          renderTabBar={props =>
            <TabBar
              {...props}
              useNativeDriver
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
  replaceCurrentRoute: PropTypes.func.isRequired
};

export default connect(null, { replaceCurrentRoute })(CreateMainScreen);
