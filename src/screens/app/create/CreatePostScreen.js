import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button, MultiLineInput } from '../../../components/common';

class CreatePostScreen extends Component {
  state = {
    topic: 'Choose Topic',
    body: ''
  }

  handleChangeText = body => this.setState(() => ({ body }))

  // BUG: Keyboard must be hidden in order for a button to be pressed?
  // REASON: Enclosing ScrollView is causing this - how to fix?
  render() {
    return (
      <View style={styles.centerItems}>
        <Button onPress={() => this.props.navigation.navigate('ChooseTopic')}>
          <Text>{this.state.topic}</Text>
        </Button>
        <Button onPress={() => console.log('enable location')}>
          <Text>{'Enable Location (optional)'}</Text>
        </Button>
        <MultiLineInput
          placeholder="Body"
          value={this.state.body}
          onChangeText={this.handleChangeText}
          width={Dimensions.get('window').width - 40}
          height={200}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CreatePostScreen;
