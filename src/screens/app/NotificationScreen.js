import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import DataList from '../../components/common/DataList';

const notifications = [
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
  {},
];

class NotificationScreen extends Component {
  componentDidMount() {
    console.log(this.props);
    console.log('grab notification feed here');
  }

  render() {
    return (
      <View style={styles.centerItems}>
        <Text>Notification Screen!</Text>
      </View>
    );
  }
}

NotificationScreen.propTypes = {

};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default NotificationScreen;
