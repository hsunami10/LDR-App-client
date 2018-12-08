import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import { View, Animated, Keyboard } from 'react-native';
import { SearchHeader } from '../../../components/common';
import GeneralSearchScreen from '../GeneralSearchScreen';
import FeedScreen from './FeedScreen';
import FriendListScreen from './FriendListScreen';
import TopicListScreen from './TopicListScreen';

class HomeScreen extends Component {
  state = {
    navigationState: {
      index: 1,
      routes: [
        { key: 'friends', title: 'Friends' },
        { key: 'feed', title: 'Feed' },
        { key: 'topics', title: 'Topics' }
      ]
    },
    mounted: {
      friends: false,
      topics: false
    },

    search: '',
    oldSearch: '',
    typingTimeout: null,
    opacity: new Animated.Value(0),
    display: 'none',
    height: 0,
    posts2: [
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
      { id: shortid(), text: `Text Here + ${shortid()}` },
    ]
  }

  searchResults = () => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    if (this.state.oldSearch !== this.state.search) {
      console.log(`search up: ${this.state.search} in general search`);
      // TODO: Figure out how to query database
      // Store search result in database - discover_searches
    }
    this.setState(() => ({ oldSearch: this.state.search, typingTimeout: null }));
  }

  handleScroll = () => Keyboard.dismiss()

  handleSearchFocus = () => {
    this.setState(() => ({ display: 'flex' }));
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  handleCancelPress = () => {
    Keyboard.dismiss();
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    this.setState(() => ({ search: '', typingTimeout: null }));
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      this.setState(() => ({ display: 'none' }));
      // TODO: Reset search results - back to default animated view
    });
  }

  handleChangeText = search => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState(() => ({
      search,
      typingTimeout: setTimeout(() => {
        // TODO: Call action for API endpoint here
        // Query data from database here
        if (this.state.search.length !== 0) {
          console.log(`show '${this.state.search}' top (10?) popular searches of all time`);
        }
      }, 1000)
    }));
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  handleIndexChange = index => {
    if (index !== this.state.navigationState.index) {
      this.setState(prevState => {
        let mounted = { ...prevState.mounted };
        switch (index) {
          case 0:
            if (!prevState.mounted.friends) {
              mounted = {
                ...prevState.mounted,
                friends: true
              };
            }
            break;
          case 2:
            if (!prevState.mounted.topics) {
              mounted = {
                ...prevState.mounted,
                topics: true
              };
            }
            break;
          default:
            break;
        }
        return {
          navigationState: {
            ...prevState.navigationState,
            index
          },
          mounted
        };
      });
    }
  }

  handleTabPress = ({ route }) => {
    switch (route.key) {
      case 'friends':
        if (!this.state.mounted.friends) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, friends: true } }));
        }
        break;
      case 'topics':
        if (!this.state.mounted.topics) {
          this.setState(prevState => ({ mounted: { ...prevState.mounted, topics: true } }));
        }
        break;
      default:
        return;
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'friends':
        if (this.state.mounted.friends) {
          return (
            <FriendListScreen
              showFriendRequests
              navigation={this.props.navigation}
              parentNavigation={this.props.screenProps.parentNavigation}
            />
          );
        }
        break;
      case 'feed':
        return (
          <FeedScreen
            navigation={this.props.navigation}
            parentNavigation={this.props.screenProps.parentNavigation}
          />
        );
      case 'topics':
        if (this.state.mounted.topics) {
          return (
            <TopicListScreen
              navigation={this.props.navigation}
              parentNavigation={this.props.screenProps.parentNavigation}
            />
          );
        }
        break;
      default:
        return;
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <SearchHeader
          placeholder="Search..."
          value={this.state.search}
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.searchResults}
          onFocus={this.handleSearchFocus}
          onCancelPress={this.handleCancelPress}
          animationDuration={200}
          returnKeyType="search"
        />
        <View
          style={{ flex: 1 }}
          onLayout={this.handleLayout}
        >
          <TabView
            tabBarPosition="top"
            navigationState={this.state.navigationState}
            renderScene={this.renderScene}
            renderTabBar={props =>
              <TabBar
                {...props}
                useNativeDriver
                onTabPress={this.handleTabPress}
                // indicatorStyle={{ borderBottomColor: 'pink', borderBottomWidth: 2 }}
              />
            }
            onIndexChange={this.handleIndexChange}
            useNativeDriver
          />
          <GeneralSearchScreen
            display={this.state.display}
            opacity={this.state.opacity}
            height={this.state.height}
            results={this.state.posts2}
          />
        </View>
      </View>
    );
  }
}

HomeScreen.propTypes = {
  screenProps: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired,
  current_route: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id,
  current_route: state.navigation.current_route,
  current_tab: state.navigation.current_tab
});

export default connect(mapStateToProps, null)(HomeScreen);
