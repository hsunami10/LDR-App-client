import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, Text } from 'react-native';

export const Input = props => {
  const { inputStyle, labelStyle, containerStyle } = styles;
  const {
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    showLabel,
    showBorder,
    borderColor,
    onSubmitEditing,
    autoFocus
  } = props;

  return (
    <View
      style={[
        containerStyle, { borderWidth: (showBorder ? 1 : 0),
          borderColor: borderColor || 'red' }
        ]}
    >
      {showLabel ? <Text style={labelStyle}>{label || 'Label'}</Text> : null}
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        style={inputStyle}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
      />
    </View>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  showLabel: PropTypes.bool,
  showBorder: PropTypes.bool,
  borderColor: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  autoFocus: PropTypes.bool
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
    alignItems: 'center',
    borderColor: 'red'
  }
};
