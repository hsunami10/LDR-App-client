import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import { StandardHeader, ClickableImage } from '../../components/common';

// BUG: Cannot change crop rect dimension with ImagePicker

class CreateProfileScreen extends Component {
  onPressAction = index => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          width: 300,
          height: 300,
          cropperToolbarTitle: 'Move and Scale',
          cropping: true
        }).then(image => {
          console.log(image);
        }).catch(err => {
          console.log(err);
        });
        break;
      case 1:
        ImagePicker.openPicker({
          width: 300,
          height: 300,
          cropperToolbarTitle: 'Move and Scale',
          cropping: true
        }).then(image => {
          console.log(image);
        }).catch(err => {
          console.log(err);
        });
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
