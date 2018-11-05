import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Picker } from 'react-native';

// TODO: Finish choosing aliases
// https://facebook.github.io/react-native/docs/picker
const AliasPicker = props => (
  <View style={styles.viewStyle}>
    <Picker
      selectedValue={props.selectedAlias}
      onValueChange={props.handleAliasChange}
    >
      <Picker.Item label="None" value={-1} />
      {props.aliases.map((e, i) => <Picker.Item label={e.alias} value={i} />)}
    </Picker>
  </View>
);

AliasPicker.propTypes = {
  selectedAlias: PropTypes.string.isRequired,
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
