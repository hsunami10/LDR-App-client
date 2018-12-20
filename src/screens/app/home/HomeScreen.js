import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import { View, Animated, Keyboard } from 'react-native';
import { SearchHeader } from '../../../components/common';
import GeneralSearchScreen from '../GeneralSearchScreen';
import {
  searchTerm,
  getUserSearches,
  resetSearch,
  showResultTabs,
} from '../../../actions/SearchActions';
import FeedScreen from './FeedScreen';
import SocialScreen from './SocialScreen';
import HomeTopicScreen from './HomeTopicScreen';

class HomeScreen extends Component {
  state = {
    navigationState: {
      index: 1,
      routes: [
        { key: 'social', title: 'Social' },
        { key: 'feed', title: 'Feed' },
        { key: 'topics', title: 'Topics' }
      ]
    },
    mounted: {
      social: false,
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
      this.props.searchTerm('home', this.props.id, this.state.search.trim());
      this.setState(() => ({
        oldSearch: this.state.search,
        typingTimeout: null
      }));
    }
  }

  handleSearchFocus = () => {
    if (this.state.firstFocus) { // Only search on the very first text input focus
      this.props.getUserSearches(this.props.id, this.state.search.trim(), false, 'home');
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
      this.props.resetSearch('home');
      this.props.showResultTabs('home', false);
    });
  }

  handleChangeText = search => {
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout);
    }

    this.setState(prevState => {
      // Always hide tabs if no text
      // Otherwise, only show tabs if the text is the same as the last submitted search
      const showTabs = search.trim() === '' ? false : prevState.oldSearch.trim() === search.trim();
      this.props.showResultTabs('home', showTabs);
      return {
        search,
        typingTimeout: setTimeout(() => {
          if (search.trim() !== prevState.search.trim() && !showTabs) { // Only grab data if not showing tabs
            this.props.getUserSearches(this.props.id, search.trim(), null, 'home');
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
            if (!prevState.mounted.social) {
              mounted = {
                ...prevState.mounted,
                social: true
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
      case 'social':
        break;
      case 'topics':
        break;
      default:
        return;
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'social':
        if (this.state.mounted.social) {
          return (
            <SocialScreen
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
            <HomeTopicScreen
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
                // indicatorStyle={{ borderBottomColor: 'pink', borderBottomWidth: 2 }}
              />
            }
            onIndexChange={this.handleIndexChange}
            useNativeDriver
          />
          <GeneralSearchScreen
            type="home"
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

HomeScreen.propTypes = {
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

const mapStateToProps = state => ({
  id: state.auth.id,
  current_route: state.navigation.current_route,
  current_tab: state.navigation.current_tab,
  showTabs: state.search.home.showTabs,
});

export default connect(mapStateToProps, {
  searchTerm,
  getUserSearches,
  resetSearch,
  showResultTabs,
})(HomeScreen);
