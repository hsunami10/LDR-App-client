import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Keyboard } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { orderToArrData } from '../../../assets/helpers/preprocess';
import SearchUserScreen from './SearchUserScreen';
import SearchPostScreen from './SearchPostScreen';
import SearchTopicScreen from './SearchTopicScreen';

class SearchResultScreen extends Component {
  state = {
    navigationState: {
      index: 1,
      routes: [
        { key: 'users', title: 'Users' },
        { key: 'posts', title: 'Posts' },
        { key: 'topics', title: 'Topics' }
      ]
    }
  }

  handleTabPress = () => Keyboard.dismiss()

  handleIndexChange = index => {
    if (index !== this.state.navigationState.index) {
      this.setState(prevState => ({
        navigationState: {
          ...prevState.navigationState,
          index
        }
      }));
    }
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case 'users':
        return (
          <SearchUserScreen
            type={this.props.type}
            navigation={this.props.navigation}
            parentNavigation={this.props.parentNavigation}
          />
        );
      case 'posts':
        return (
          <SearchPostScreen
            type={this.props.type}
            navigation={this.props.navigation}
            parentNavigation={this.props.parentNavigation}
          />
        );
      case 'topics':
        return (
          <SearchTopicScreen
            type={this.props.type}
            navigation={this.props.navigation}
            parentNavigation={this.props.parentNavigation}
          />
        );
      default:
        break;
    }
    return null;
  }

  render() {
    return (
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
    );
  }
}

SearchResultScreen.propTypes = {
  type: PropTypes.oneOf(['home', 'discover']).isRequired,
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = (state, ownProps) => ({
  id: state.auth.id,
  users: orderToArrData(state.search[ownProps.type].results.users.order, state.social.all_users),
  topics: orderToArrData(state.search[ownProps.type].results.topics.order, state.topics.all_topics),
  term: state.search[ownProps.type].term,
});

export default connect(mapStateToProps, null)(SearchResultScreen);
