import React, { Component } from 'react';
import { View, Text } from 'react-native';
import general from '../../constants/styles/general';

class ViewPostScreen extends Component {
  render() {
    return (
      <View style={general.centerItems}>
        <Text>View Post Screen!</Text>
      </View>
    );
  }
}

export default ViewPostScreen;
