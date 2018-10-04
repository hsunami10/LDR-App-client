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
    }
  }

  componentWillUnmount() {
    this.props.popRoute(this.props.routes[this.props.routes.length - 2]);
  }

  handleIndexChange = index => {
    this.setState((prevState) => {
      return {
        navigationState: { ...prevState.navigationState, index }
      };
    });
  }

  handleScroll = () => {
    Keyboard.dismiss();
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'post':
        return <CreatePostScreen navigation={this.props.navigation} />;
      case 'topic':
        return <CreateTopicScreen navigation={this.props.navigation} />;
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
                  indicatorStyle={styles.indicatorStyle} // BUG: Offset displacement
                />
              }
              height={100}
              showRight
              rightTitle={this.state.navigationState.index === 0 ? 'Post' : 'Request'}
              onRightPress={() => {
                if (this.state.navigationState.index === 0) console.log('create post');
                else console.log('request topic');
                this.props.navigation.navigate('Main');
              }}
              showLeft
              onLeftPress={() => this.props.navigation.goBack()}
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
  routes: PropTypes.array.isRequired,
  popRoute: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  tabBarStyle: {
    marginTop: getStatusBarHeight(true),
    width: 200,
    alignSelf: 'center'
  },
  indicatorStyle: {
    width: 100,
    alignSelf: 'center'
  }
});

const mapStateToProps = state => ({ routes: state.navigation.routes });

export default connect(mapStateToProps, { popRoute })(CreateMainScreen);
