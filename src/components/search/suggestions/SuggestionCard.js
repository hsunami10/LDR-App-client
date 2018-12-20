import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { ClickableImage } from '../../common';
import RedX from '../../../assets/images/red_x.png';

const SuggestionCard = ({ suggestion, onPress, onRemovePress }) => (
  <TouchableHighlight
    style={styles.containerStyle}
    onPress={() => onPress(suggestion.search_term)}
  >
    <View style={styles.viewStyle}>
      <View style={styles.textViewStyle}>
        <Text style={{ fontSize: 14 }}>{suggestion.search_term}</Text>
      </View>
      {
        suggestion.user_id ?
        <ClickableImage
          style={styles.actionStyle}
          width={20}
          height={20}
          type="opacity"
          onPress={() => onRemovePress(suggestion.id)}
          image={RedX}
        /> :
        null
      }
    </View>
  </TouchableHighlight>
);

SuggestionCard.propTypes = {
  suggestion: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  onRemovePress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  containerStyle: {
    width: Dimensions.get('window').width,
    height: 30,
    borderColor: 'lightgray',
    borderWidth: 0.4
  },
  viewStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textViewStyle: {
    marginLeft: 5
  },
  actionStyle: {
    marginLeft: 'auto',
    marginRight: 5
  },
});

export default SuggestionCard;
