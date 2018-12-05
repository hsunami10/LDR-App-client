import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

class FriendListScreen extends Component {
  render() {
    return (
      <View>
        <Text>Friends Screen!</Text>
      </View>
    );
  }
}

FriendListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id
});

export default connect(mapStateToProps, null)(FriendListScreen);
