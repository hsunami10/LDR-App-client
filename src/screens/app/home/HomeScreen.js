import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import FeedScreen from './FeedScreen';

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
