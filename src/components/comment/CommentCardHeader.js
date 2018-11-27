import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { View, Text, StyleSheet } from 'react-native';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage } from '../../components/common';

const CommentCardHeader = ({ comment, viewProfile }) => (
  <View style={styles.viewStyle}>
    <ClickableImage
      width={40}
      height={40}
      type="opacity"
      onPress={() => viewProfile(comment.author_id, comment.username)}
      image={comment.profile_pic ? `${ROOT_URL}/${comment.profile_pic}` : null}
    />
    <View style={styles.middleStyle}>
      <Text
        style={{ fontWeight: 'bold' }}
        onPress={() => viewProfile(comment.author_id, comment.username)}
      >
        {comment.username}
      </Text>
    </View>
    <View style={styles.dateStyle}>
      <Text>{`${moment(moment.unix(parseInt(comment.date_sent, 10))).fromNow(true)} ago`}</Text>
    </View>
  </View>
);

CommentCardHeader.propTypes = {
  comment: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10
  },
  middleStyle: {
    marginLeft: 10
  },
  dateStyle: {
    marginLeft: 'auto',
    marginRight: 0
  }
});

export default CommentCardHeader;
