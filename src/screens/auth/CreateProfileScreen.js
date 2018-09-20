import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import {
  StandardHeader,
  ClickableImage,
  MultiLineInput,
  DismissKeyboard,
  Button
} from '../../components/common';
import { alertPermission } from '../../assets/helpers';

// BUG: Cannot change crop rect dimension with ImagePicker

class CreateProfileScreen extends Component {
  state = {
    bio: '',
    buttonText: 'Get Location',
    loading: false,
    cameraPermission: '',
    locationPermission: '',
    photoPermission: ''
  }

  componentDidMount() {
    Permissions.checkMultiple(['camera', 'photo', 'location']).then(response => {
      this.setState(() => ({
        cameraPermission: response.camera,
        locationPermission: response.location,
        photoPermission: response.photo
      }));
    });
  }

  onPressAction = index => {
    switch (index) {
      case 0:
        if (this.state.cameraPermission === 'authorized') {
          this.openCamera();
        } else {
          alertPermission(this.state.cameraPermission, this.requestPermission, 'camera');
        }
        break;
      case 1:
        if (this.state.photoPermission === 'authorized') {
          this.openPhotos();
        } else {
          alertPermission(this.state.photoPermission, this.requestPermission, 'photo');
        }
        break;
      default:
        return;
    }
  }

  createProfile = () => {
    console.log('create profile');
  }

  locationPressed = () => {
    if (this.state.locationPermission === 'authorized') {
      this.updateLocation();
    } else {
      alertPermission(this.state.locationPermission, this.requestPermission, 'location');
    }
  }

  handleChangeText = bio => this.setState(() => ({ bio }))

  showActionSheet = () => this.ActionSheet.show()

  ref = o => {
    this.ActionSheet = o;
    return this.ActionSheet;
  }

  requestPermission = type => {
    Permissions.request(type).then(response => {
      if (response === 'authorized') {
        switch (type) {
          case 'camera':
            this.openCamera();
            break;
          case 'location':
            this.updateLocation();
            break;
          case 'photo':
            this.openPhotos();
            break;
          default:

        }
      }
    });
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

  updateLocation = () => {
    console.log('update location');
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
            <Button
              onPress={this.locationPressed}
              loading={this.state.loading}
              style={{ marginTop: 10 }}
            >
              <Text>{this.state.buttonText}</Text>
            </Button>
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
