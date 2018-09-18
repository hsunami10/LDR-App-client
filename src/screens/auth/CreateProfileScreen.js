import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { StandardHeader, ClickableImage } from '../../components/common';

// BUG: Swiping back with this goes to the AuthLoadingScreen?
class CreateProfileScreen extends Component {
  onPressAction = index => {
    switch (index) {
      case 0:
        console.log('take photo');
        break;
      case 1:
        console.log('choose from library');
        break;
      default:
        return;
    }
  }

  showActionSheet = () => this.ActionSheet.show();

  ref = o => {
    this.ActionSheet = o;
    return this.ActionSheet;
  }

  render() {
    return (
      <View>
        <StandardHeader
          showRight
          rightTitle="Create"
          title="Create Profile"
          onRightPress={() => console.log('create profile')}
          disableBack
        />
        <View style={styles.viewStyle}>
          <Text>Create Profile!</Text>
          <ClickableImage
            width={200}
            height={200}
            onPress={this.showActionSheet}
            type="none"
          />
        </View>
        <ActionSheet
          ref={this.ref}
          options={['Take Photo', 'Choose from Library', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.onPressAction}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default CreateProfileScreen;
