import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { StandardHeader } from '../../components/common';

// BUG: Swiping back with this goes to the AuthLoadingScreen?
class CreateProfileScreen extends Component {
  render() {
    return (
      <View>
        <StandardHeader
          showRight
          rightTitle="Create"
          title="Create Profile"
          onRightPress={() => console.log('create profile')}
          disableBack
        />
        <View>
          <Text>Create Profile!</Text>
        </View>
      </View>
    );
  }
}

export default CreateProfileScreen;
