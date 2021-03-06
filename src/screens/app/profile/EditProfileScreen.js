import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

// Get user info api point - type: edit
class EditProfileScreen extends Component {
  render() {
    return (
      <View style={styles.centerItems}>
        <Text>Notification Screen!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditProfileScreen;
