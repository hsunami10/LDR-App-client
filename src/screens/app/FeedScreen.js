import React, { Component } from 'react';
import { View, Text } from 'react-native';
import general from '../../constants/styles/general';

class FeedScreen extends Component {
  render() {
    return (
      <View style={general.centerItems}>
        <Text>Feed Screen!</Text>
      </View>
    );
  }
}

export default FeedScreen;
