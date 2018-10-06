import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Input, MultiLineInput, DismissKeyboard } from '../../../components/common';
import { errorTextStyle } from '../../../constants/styles/text';

const CreateTopicScreen = props => (
  <DismissKeyboard>
    <View style={styles.centerItems}>
      <Input
        placeholder="Name"
        value={props.name}
        onChangeText={props.handleChangeName}
        showBorder={props.error.type === 'name'}
      />
      <MultiLineInput
        width={Dimensions.get('window').width - 40}
        height={200}
        placeholder="Description"
        value={props.description}
        onChangeText={props.handleChangeDescription}
        showBorder={props.error.type === 'description'}
        borderColor="red"
      />
      <Text style={errorTextStyle}>{props.error.msg}</Text>
    </View>
  </DismissKeyboard>
);

CreateTopicScreen.propTypes = {
  handleChangeName: PropTypes.func.isRequired,
  handleChangeDescription: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    alignItems: 'center'
  }
});

export default CreateTopicScreen;
