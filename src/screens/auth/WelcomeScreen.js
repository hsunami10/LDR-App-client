import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { connect } from 'react-redux';
import { ROOT_URL } from '../../constants/variables';
import { navigateToRoute } from '../../actions/NavigationActions';

class WelcomeScreen extends Component {
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
