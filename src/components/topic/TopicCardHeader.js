import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { ClickableImage } from '../common';
import { ROOT_URL } from '../../constants/variables';

const TopicCardHeader = ({ topic }) => (
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
      <Text
        style={{ fontWeight: 'bold', fontSize: 14 }}
        numberOfLines={1}
        suppressHighlighting
        ellipsizeMode="tail"
      >
        {topic.name}
      </Text>
      <Text style={{ fontWeight: '500', fontSize: 12 }}>{topic.num_subscribers} subscribers</Text>
    </View>
  </View>
);

TopicCardHeader.propTypes = {
  topic: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    flexDirection: 'row',
  },
  textViewStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  }
});

export default TopicCardHeader;
