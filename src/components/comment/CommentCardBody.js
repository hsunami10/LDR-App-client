import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

const CommentCardBody = props => (
  <View style={styles.viewStyle}>
    <Text suppressHighlighting>{props.comment.body}</Text>
  </View>
);

CommentCardBody.propTypes = {
  comment: PropTypes.object.isRequired,
  viewing: PropTypes.bool,
  viewPost: PropTypes.func
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    padding: 5,
    margin: 5
  },
  moreTextStyle: {
    fontWeight: '300',
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5
  }
});

export default CommentCardBody;
