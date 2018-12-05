import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

class TopicListScreen extends Component {
  render() {
    return (
      <View>
        <Text>Topics Screen!</Text>
      </View>
    );
  }
}

TopicListScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,

  id: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  id: state.auth.id
});

export default connect(mapStateToProps, null)(TopicListScreen);
