import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions } from 'react-native';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {
  StandardHeader,
  ClickableImage,
  MultiLineInput,
  DismissKeyboard
} from '../../components/common';
import { alertPermission, checkPermission } from '../../assets/helpers';

// BUG: Cannot change crop rect dimension with ImagePicker

class CreateProfileScreen extends Component {
  state = {
    bio: '',
    buttonText: 'Enable Location',
    loading: false
  }

  onPressAction = index => {
    switch (index) {
      case 0:
        checkPermission('camera', this.handleCheckPermission);
        break;
      case 1:
        checkPermission('photo', this.handleCheckPermission);
        break;
      default:
        return;
    }
  }

  createProfile = () => {
    console.log('create profile');
  }

  handleChangeText = bio => this.setState(() => ({ bio }))

  showActionSheet = () => this.ActionSheet.show()

  ref = o => {
    this.ActionSheet = o;
    return this.ActionSheet;
  }

  handleCheckPermission = (type, response) => {
    this.handlePermissionAction(type, response);
    alertPermission(response, this.requestPermission, type);
  }

  requestPermission = type => {
    Permissions.request(type)
      .then(response => this.handlePermissionAction(type, response));
  }

  handlePermissionAction = (type, response) => {
    switch (type) {
      case 'camera':
        if (response === 'authorized') {
          this.openCamera();
          return;
        }
        break;
      case 'photo':
        if (response === 'authorized') {
          this.openPhotos();
          return;
        }
        break;
      default:
        return;
    }
  }

  openCamera = () => {
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
  }

  openPhotos = () => {
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
  }

  render() {
    return (
      <DismissKeyboard>
        <View style={{ flex: 1 }}>
          <StandardHeader
            showRight
            rightTitle="Create"
            title="Create Profile"
            onRightPress={this.createProfile}
            disableBack
            disableRight={this.state.loading}
          />
          <View style={styles.viewStyle}>
            <ClickableImage
              width={150}
              height={150}
              onPress={this.showActionSheet}
              type="none"
            />
            <MultiLineInput
              multiline
              numberOfLines={4}
              placeholder="Bio (optional)"
              onChangeText={this.handleChangeText}
              value={this.state.bio}
              width={Dimensions.get('window').width - 20}
              height={Dimensions.get('window').width - 250}
              containerStyle={{ marginTop: 10 }}
            />
          </View>
          <ActionSheet
            ref={this.ref}
            options={['Take Photo', 'Choose from Library', 'Cancel']}
            cancelButtonIndex={2}
            onPress={this.onPressAction}
          />
        </View>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  }
});

export default CreateProfileScreen;
