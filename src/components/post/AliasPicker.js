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
      <Picker.Item key={-1} label="None" value={-1} />
      {props.aliases.map((e, i) => <Picker.Item key={i} label={e.alias} value={i} />)}
    </Picker>
  </View>
);

AliasPicker.propTypes = {
  selectedAlias: PropTypes.number.isRequired,
  handleAliasChange: PropTypes.func.isRequired,
  aliases: PropTypes.arrayOf(PropTypes.object).isRequired
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
