import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { ROOT_URL } from '../../constants/variables';
import { ClickableImage } from '../common';

const UserCardHeader = ({ user }) => (
  <View style={styles.headerStyle}>
    <ClickableImage
      width={40}
      height={40}
      type="none"
      disabled
      image={user.profile_pic ? `${ROOT_URL}/${user.profile_pic}` : null}
    />
    <Text
      style={{ fontWeight: 'bold', marginLeft: 10, marginRight: 10 }}
      suppressHighlighting
    >
      {user.username}
    </Text>
  </View>
);

UserCardHeader.propTypes = {
  user: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  headerStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});

export default UserCardHeader;
