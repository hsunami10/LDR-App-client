import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TabView, TabBar } from 'react-native-tab-view';
import { View, Text } from 'react-native';
import FeedScreen from './FeedScreen';

// TODO: Add TabView and TabBar
// QUESTION: How to stick tab bar to top of screen when scrolling up?
class HomeScreen extends Component {
  render() {
    return (
      <FeedScreen
        screenProps={this.props.screenProps}
        navigation={this.props.navigation}
      />
    );
  }
}

HomeScreen.propTypes = {
  screenProps: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id
});

export default connect(mapStateToProps, null)(HomeScreen);
