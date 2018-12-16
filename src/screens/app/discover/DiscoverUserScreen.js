import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

class DiscoverUserScreen extends Component {
  componentDidMount() {
    console.log('grab discover user here');
  }

  render() {
    return (
      <View>
        <Text>
          Discover User Screen!
        </Text>
      </View>
    );
  }
}

DiscoverUserScreen.propTypes = {
  id: PropTypes.string.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => ({
  id: state.auth.id,
});

export default connect(mapStateToProps, null)(DiscoverUserScreen);
