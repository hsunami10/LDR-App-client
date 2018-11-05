import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Picker, Dimensions } from 'react-native';

// TODO: Finish choosing aliases
// https://facebook.github.io/react-native/docs/picker
const AliasPicker = props => (
  <View style={styles.viewStyle}>
    <Picker
      selectedValue={props.selectedAlias}
      onValueChange={props.handleAliasChange}
    >
      <Picker.Item label="None" value={-1} />
      <Picker.Item label="None1" value={-16} />
      <Picker.Item label="None2" value={-15} />
      <Picker.Item label="None3" value={-14} />
      <Picker.Item label="None4" value={-13} />
      <Picker.Item label="None5" value={-12} />
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
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    width: Dimensions.get('window').width
  }
});

export default AliasPicker;
