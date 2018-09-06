import React, { Component } from 'react';
import { View, Text } from 'react-native';
import general from '../../constants/styles/general';

class ViewProfileScreen extends Component {
  render() {
    return (
      <View style={general.centerItems}>
        <Text>View Profile Screen!</Text>
      </View>
    );
  }
}

export default ViewProfileScreen;
