import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import { ROOT_URL } from '../../constants/variables';
import { navigateToRoute } from '../../actions/NavigationActions';

class WelcomeScreen extends Component {
  // NOTE: Testing moment unix timestamps, remove this later
  componentDidMount() {
    console.log(`get the current unix timestamp (seconds): ${moment().unix()}`);
    console.log(`in human readable time: ${moment.unix(moment().unix()).calendar(null, {
      sameDay: '[Today], hh:mm:ss A',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'DD/MM/YYYY'
    })}`);

    // Updated x seconds ago, etc. etc. - time from now
    console.log(`compare time now to ${moment.unix(1537662236).format('MMM D, YYYY [at] hh:mm:ss A')}`);
    console.log(moment(moment.unix(1537662236)).fromNow(true));
  }

  handlePress = route => {
    this.props.navigateToRoute(route);
    this.props.navigation.navigate(route);
  }

  render() {
    return (
      <View style={styles.viewStyle}>
        <Text>Welcome Screen!</Text>
        <Button
          onPress={() => this.handlePress('LogIn')}
          title="Log In"
          color="blue"
        />
        <Button
          onPress={() => this.handlePress('SignUp')}
          title="Sign Up"
          color="blue"
        />
        {/* TODO: Remove this later */}
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: `${ROOT_URL}/images/groups/nature.jpeg` }}
        />
      </View>
    );
  }
}

WelcomeScreen.propTypes = {
  navigateToRoute: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default connect(null, { navigateToRoute })(WelcomeScreen);
