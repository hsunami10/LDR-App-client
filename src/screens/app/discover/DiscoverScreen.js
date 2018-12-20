import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TabView, TabBar } from 'react-native-tab-view';
import { connect } from 'react-redux';
import { View, Animated, Keyboard, StyleSheet } from 'react-native';
import { SearchHeader } from '../../../components/common';
import {
  searchTerm,
  getUserSearches,
  resetSearch,
  showResultTabs,
} from '../../../actions/SearchActions';
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
    display: 'none',
    height: 0,
    firstFocus: true
  }

  fillSearchText = term => this.setState(() => ({ search: term, oldSearch: term }))

  searchResults = () => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }
    if (this.state.oldSearch.trim() !== this.state.search.trim() && this.state.search.trim()) {
      this.props.searchTerm('discover', this.props.id, this.state.search.trim());
      this.setState(() => ({
        oldSearch: this.state.search,
        typingTimeout: null
      }));
    }
  }

  handleSearchFocus = () => {
    if (this.state.firstFocus) { // Only search on the very first text input focus
      this.props.getUserSearches(this.props.id, this.state.search.trim(), false, 'discover');
    }
    this.setState(() => ({ display: 'flex', firstFocus: false }));
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
    this.setState(() => ({
      search: '',
      oldSearch: '',
      typingTimeout: null,
      firstFocus: true
    }));
    Animated.timing(this.state.opacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      this.setState(() => ({ display: 'none' }));
      this.props.resetSearch('discover');
      this.props.showResultTabs('discover', false);
    });
  }

  handleChangeText = search => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState(prevState => {
      const showTabs = search.trim() === '' ? false : prevState.oldSearch.trim() === search.trim();
      this.props.showResultTabs('discover', showTabs);
      return {
        search,
        showTabs,
        typingTimeout: setTimeout(() => {
          if (prevState.search.trim() !== search.trim() && !showTabs) {
            this.props.getUserSearches(this.props.id, search.trim(), null, 'discover');
          }
        }, 500)
      };
    });
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
            type="discover"
            display={this.state.display}
            opacity={this.state.opacity}
            height={this.state.height}
            fillSearch={this.fillSearchText}
            navigation={this.props.navigation}
            parentNavigation={this.props.screenProps.parentNavigation}
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
  searchTerm: PropTypes.func.isRequired,
  getUserSearches: PropTypes.func.isRequired,
  resetSearch: PropTypes.func.isRequired,
  showTabs: PropTypes.bool.isRequired,
  showResultTabs: PropTypes.func.isRequired,

  screenProps: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => ({
  id: state.auth.id,
  current_route: state.navigation.current_route,
  current_tab: state.navigation.current_tab,
  showTabs: state.search.discover.showTabs,
});

export default connect(mapStateToProps, {
  searchTerm,
  getUserSearches,
  resetSearch,
  showResultTabs,
})(DiscoverScreen);
