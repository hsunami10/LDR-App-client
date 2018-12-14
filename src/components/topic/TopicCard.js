import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { ClickableImage } from '../common';
import { ROOT_URL } from '../../constants/variables';

// TODO: Finish post cards - to show in feed
const TopicCard = ({ topic, onPress }) => (
  <TouchableHighlight
    onPress={onPress}
    underlayColor="rgba(0,0,0,0.3)"
  >
    <View style={styles.viewStyle}>
      <ClickableImage
        type="none"
        image={topic.topic_pic ? `${ROOT_URL}/${topic.topic_pic}` : null}
        disabled
        width={35}
        height={35}
        style={{ alignSelf: 'center', marginLeft: 5, marginRight: 5 }}
      />
      <View style={styles.textViewStyle}>
        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{topic.name}</Text>
        <Text style={{ fontWeight: '500', fontSize: 12 }}>{topic.num_subscribers} subscribers</Text>
      </View>
    </View>
  </TouchableHighlight>
);

TopicCard.propTypes = {
  topic: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    height: 45,
    borderWidth: 1,
    borderColor: 'gray'
  },
  textViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  }
});

export default TopicCard;
