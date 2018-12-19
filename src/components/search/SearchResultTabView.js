import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, Text, Keyboard } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { orderToArrData } from '../../assets/helpers/preprocess';
import DataList from '../../components/common/DataList';

class SearchResultTabView extends Component {
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

  handleRefresh = () => {

  }

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
        return <Text>Users List Here!</Text>;
      case 'posts':
        return <Text>Posts List Here!</Text>;
      case 'topics':
        return <Text>Topics List Here!</Text>;
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

SearchResultTabView.propTypes = {
  type: PropTypes.oneOf(['home', 'discover']).isRequired,

  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  topics: PropTypes.arrayOf(PropTypes.object).isRequired,
  initial_loading: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = (state, ownProps) => ({
  users: orderToArrData(state.search[ownProps.type].results.users.order, state.social.all_users),
  posts: orderToArrData(state.search[ownProps.type].results.posts.order, state.posts.all_posts),
  topics: orderToArrData(state.search[ownProps.type].results.topics.order, state.topics.all_topics),
  initial_loading: state.search[ownProps.type].initial_loading,
});

export default connect(mapStateToProps, null)(SearchResultTabView);
