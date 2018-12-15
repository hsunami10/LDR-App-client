import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

const UserCardBody = ({ user }) => {
  if (user.type === 'request') {
    return (
      <View style={styles.viewStyle}>
        <Text style={{ fontSize: 12 }} suppressHighlighting>
          {user.message}
        </Text>
      </View>
    );
  }
  return null;
};

UserCardBody.propTypes = {
  user: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    marginTop: 10,
  }
});

export default UserCardBody;
