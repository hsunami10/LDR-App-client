import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';

const NotificationCard = ({ notification, viewProfile, viewPost }) => (
  <View>
    <Text>
      {notification.body}
    </Text>
  </View>
);

NotificationCard.propTypes = {
  notification: PropTypes.object.isRequired,
  viewProfile: PropTypes.func.isRequired,
  viewPost: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  
});

export default NotificationCard;
