import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, View, } from 'react-native';

// TODO: Finish making multi-line input component

export const MultiLineInput = props => {
  const {
    value,
    width,
    height,
    onChangeText,
    placeholder,
    secureTextEntry,
    borderColor,
    borderWidth,
    onSubmitEditing,
    autoFocus,
    numberOfLines,
    inputStyle,
    containerStyle
  } = props;

  return (
    <View
      style={[
        {
          width,
          height,
          borderWidth: borderWidth || 0,
          borderColor: borderColor || 'transparent'
        },
        containerStyle || {}
      ]}
    >
      <TextInput
        multiline
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        value={value}
        onChangeText={onChangeText}
        style={[styles.inputStyle, inputStyle || {}]}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        numberOfLines={numberOfLines}
      />
    </View>
  );
};

MultiLineInput.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  showLabel: PropTypes.bool,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  onSubmitEditing: PropTypes.func,
  autoFocus: PropTypes.bool,
  numberOfLines: PropTypes.number,
  inputStyle: PropTypes.object,
  containerStyle: PropTypes.object
};

const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2,
    borderColor: 'black',
    borderWidth: 1
  }
};
