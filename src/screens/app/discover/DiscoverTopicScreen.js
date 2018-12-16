import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

class DiscoverTopicScreen extends Component {
  componentDidMount() {
    console.log('get topics here');
  }

  handleLayout = e => {
    const { height } = e.nativeEvent.layout;
    this.setState(() => ({ height }));
  }

  render() {
    return (
      <View
        style={{ flex: 1 }}
        onLayout={this.handleLayout}
      >
        <Text>
          Discover User Screen!
        </Text>
      </View>
    );
  }
}

DiscoverTopicScreen.propTypes = {
  id: PropTypes.string.isRequired,

  navigation: PropTypes.object.isRequired,
  parentNavigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({

});

const mapStateToProps = state => ({
  id: state.auth.id,
});

export default connect(mapStateToProps, null)(DiscoverTopicScreen);
