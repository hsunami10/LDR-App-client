import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabView, TabBar } from 'react-native-tab-view';
import shortid from 'shortid';
import { connect } from 'react-redux';
import { View, Animated, Keyboard, StyleSheet } from 'react-native';
import { SearchHeader } from '../../../components/common';
import DiscoverUserScreen from './DiscoverUserScreen';
import DiscoverPostScreen from './DiscoverPostScreen';
import DiscoverTopicScreen from './DiscoverTopicScreen';
import GeneralSearchScreen from '../GeneralSearchScreen';

// TODO: Have 3 tabs and 3 screens automatically - Users, Posts, Topics - default to middle "Posts"
// When search is clicked, show animated view with top 10 popular search terms of all time (grabbed from database)
// When the user starts typing, show the top 5 popular search terms of all for the keyword OR trending searches today (top 5 searches made today)
// When the user clicks enter or scrolls, then search up data in database

class DiscoverScreen extends Component {
  state = {
    navigationState: {
      index: 1,
      routes: [
        { key: 'users', title: 'Users' },
        { key: 'posts', title: 'Posts' },
        { key: 'topics', title: 'Topics' }
      ]
    },
    mounted: {
      users: false,
      topics: false
    },

    search: '',
    oldSearch: '',
    typingTimeout: null,
    opacity: new Animated.Value(0),
    refreshing: false,
    display: 'none',
    height: 0,
    canPaginate: false,
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

  componentDidMount() {
    console.log('grab discover feed here with api endpoint');
  }

  handleContentSizeChange = (contentWidth, contentHeight) => {
    this.setState(prevState => ({
      canPaginate: contentHeight > prevState.height // Only allow pagination if content height is larger than FlatList height
    }));
  }

  handleEndReached = () => {
    // TODO: Handle pagination here
    // If no more old data, then don't do anything anymore
    console.log('discover paginate for more data here');
  };

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

  handleRefresh = () => {
    this.setState(() => ({ refreshing: true }));
    // TODO: Grab new data from database again here, and set refreshing to false
    setTimeout(() => this.setState(() => ({ refreshing: false })), 1000);
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
            if (!prevState.mounted.users) {
              mounted = {
                ...prevState.mounted,
                users: true
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
    // TODO: Handle scrolling here
    switch (route.key) {
      case 'users':
        break;
      case 'topics':
        break;
      default:
        return;
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'users':
        if (this.state.mounted.users) {
          return (
            <DiscoverUserScreen
              navigation={this.props.navigation}
              parentNavigation={this.props.screenProps.parentNavigation}
            />
          );
        }
        break;
      case 'posts':
        return (
          <DiscoverPostScreen
            navigation={this.props.navigation}
            parentNavigation={this.props.screenProps.parentNavigation}
          />
        );
      case 'topics':
        if (this.state.mounted.topics) {
          return (
            <DiscoverTopicScreen
              navigation={this.props.navigation}
              parentNavigation={this.props.screenProps.parentNavigation}
            />
          );
        }
        break;
      default:
        return null;
    }
    return null;
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

DiscoverScreen.propTypes = {
  id: PropTypes.string.isRequired,
  current_route: PropTypes.string.isRequired,
  current_tab: PropTypes.string.isRequired,

  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => ({
  id: state.auth.id,
  current_route: state.navigation.current_route,
  current_tab: state.navigation.current_tab,
});

export default connect(mapStateToProps, null)(DiscoverScreen);
