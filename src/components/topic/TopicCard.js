import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import TopicCardHeader from './TopicCardHeader';
import TopicCardActions from './TopicCardActions';

const TopicCard = ({ topic, onPress, onActionPress }) => (
  <TouchableHighlight
    onPress={onPress}
    underlayColor="rgba(0,0,0,0.3)"
  >
    <View style={styles.viewStyle}>
      <TopicCardHeader topic={topic} />
      <TopicCardActions
        id={topic.id}
        type={topic.type}
        onPress={onActionPress}
      />
    </View>
  </TouchableHighlight>
);

TopicCard.propTypes = {
  topic: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  onActionPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: 45,
    borderWidth: 0.5,
    borderColor: 'gray',
  }
});

export default TopicCard;
