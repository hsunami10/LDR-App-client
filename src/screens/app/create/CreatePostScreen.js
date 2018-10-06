import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Button, MultiLineInput, DismissKeyboard } from '../../../components/common';
import { errorTextStyle } from '../../../constants/styles/text';

const CreatePostScreen = props => (
  <DismissKeyboard>
    <View style={styles.centerItems}>
      <Button onPress={() => props.navigation.navigate('ChooseTopic')}>
        <Text>{props.topic}</Text>
      </Button>
      <Button onPress={() => console.log('enable location')}>
        <Text>{'Enable Location (optional)'}</Text>
      </Button>
      <MultiLineInput
        placeholder="Body"
        value={props.body}
        onChangeText={props.handleChangeBody}
        showBorder={props.error.type === 'body'}
        borderColor="red"
        width={Dimensions.get('window').width - 40}
        height={200}
      />
      <Text style={errorTextStyle}>{props.error.msg}</Text>
    </View>
  </DismissKeyboard>
);

CreatePostScreen.propTypes = {
  handleChangeBody: PropTypes.func.isRequired,
  body: PropTypes.string.isRequired,
  topic: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    alignItems: 'center'
  }
});

export default CreatePostScreen;
