import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import CommentCardHeader from './CommentCardHeader';
import CommentCardBody from './CommentCardBody';
import CommentCardFooter from './CommentCardFooter';

const CommentCard = ({ comment, viewProfile, parentNavigation }) => (
  <View style={styles.viewStyle}>
    <CommentCardHeader
      comment={comment}
      viewProfile={viewProfile}
    />
    <CommentCardBody comment={comment} />
    <CommentCardFooter
      comment={comment}
      parentNavigation={parentNavigation}
    />
  </View>
);

CommentCard.propTypes = {
  comment: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired,
  parentNavigation: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    borderColor: '#C1C7C9',
    borderTopWidth: 1,
    borderBottomWidth: 1
  }
});

export default CommentCard;
