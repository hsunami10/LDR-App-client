import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Picker } from 'react-native';

// TODO: Finish choosing aliases
// https://facebook.github.io/react-native/docs/picker
const AliasPicker = props => (
  <View style={styles.viewStyle}>
    <Picker
      selectedValue={props.alias}
      onValueChange={props.handleAliasChange}
    >
      <Picker.Item label="none" value="None" />
      {props.aliases.map(e => null)}
    </Picker>
  </View>
);

AliasPicker.propTypes = {
  alias: PropTypes.string.isRequired,
  handleAliasChange: PropTypes.func.isRequired,
  aliases: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center'
  }
});

export default AliasPicker;
