import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Alert } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import * as Keychain from 'react-native-keychain';
import { connect } from 'react-redux';
import { StandardHeader } from '../../../components/common';
import { handleError } from '../../../assets/helpers/index';
import { setActive } from '../../../actions/AuthActions';
import { popRoute } from '../../../actions/NavigationActions';

class ViewProfileScreen extends Component {
  onPressAction = index => {
    switch (index) {
      case 0:
        console.log('edit profile');
        break;
      case 1:
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', onPress: this.logOut }
          ]
        );
        break;
      default:
        return;
    }
  }

  showActionSheet = () => this.ActionSheet.show();

  logOut = async () => {
    try {
      await Keychain.resetGenericPassword();
      this.props.popRoute('Welcome');
      this.props.navigation.navigate('Welcome');
      setActive(this.props.id, false);
    } catch (err) {
      handleError(err);
    }
  }

  ref = o => {
    this.ActionSheet = o;
    return this.ActionSheet;
  }

  render() {
    return (
      <View>
        <StandardHeader
          title="Your Profile"
          showRight
          rightTitle="Settings" // TODO: Change to gear icon later
          onRightPress={this.showActionSheet}
        />
        <View style={styles.centerItems}>
          <Text>View Profile Screen!</Text>
        </View>
        <ActionSheet
          ref={this.ref}
          options={['Edit Profile', 'Log Out', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this.onPressAction}
        />
      </View>
    );
  }
}

ViewProfileScreen.propTypes = {
  id: PropTypes.string.isRequired,
  popRoute: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftStyle: {
    color: '#007aff',
    fontSize: 16
  }
});

const mapStateToProps = state => ({
  id: state.auth.id
});

export default connect(mapStateToProps, { popRoute })(ViewProfileScreen);
