import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';

export const Button = ({ onPress, children, loading, style }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[buttonStyle, style || {}]}
      disabled={loading}
    >
      {loading ? <ActivityIndicator /> : null}
      <Text style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element
  ]).isRequired,
  loading: PropTypes.bool,
  style: PropTypes.object
};

const styles = {
  textStyle: {
    color: '#007aff',
    fontSize: 15,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10
  },
  buttonStyle: {
    // flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch', // Tell self to fill container
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center'
  }
};
