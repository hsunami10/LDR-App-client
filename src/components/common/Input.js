import React from 'react';
import { TextInput, View, Text } from 'react-native';

export const Input = props => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  const {
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    showLabel
  } = props;

  return (
    <View style={containerStyle}>
      {showLabel ? <Text style={labelStyle}>{label || 'Label'}</Text> : null}
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        value={value}
        onChangeText={onChangeText}
        style={inputStyle}
      />
    </View>
  );
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  containerStyle: {
    height: 40,
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};
