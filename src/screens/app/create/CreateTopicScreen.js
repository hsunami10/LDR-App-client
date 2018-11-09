import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import Permissions from 'react-native-permissions';
import shortid from 'shortid';
import { Input, MultiLineInput, ClickableImage } from '../../../components/common';
import textStyles from '../../../constants/styles/text';
import { alertPermission, checkPermission } from '../../../assets/helpers';

class CreateTopicScreen extends Component {
  onPressAction = index => {
    switch (index) {
      case 0:
        checkPermission('camera', this.handleCheckPermission);
        break;
      case 1:
        checkPermission('photo', this.handleCheckPermission);
        break;
      case 2:
        if (this.props.image) {
          this.props.handleChangeImage(null);
        }
        break;
      default:
        return;
    }
  }

  ref = o => (this.ActionSheet = o)
  showActionSheet = () => this.ActionSheet.show()

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
      // width: Dimensions.get('window').width,
      // height: 300,
      cropperToolbarTitle: 'Move and Scale',
      cropping: true
    }).then(image => {
      this.props.handleChangeImage({
        uri: image.path,
        type: image.mime,
        name: image.filename || `${shortid()}.${image.mime === 'image/jpeg' ? 'JPG' : 'PNG'}`
      });
    }).catch(err => {
      console.log(err);
    });
  }

  openPhotos = () => {
    ImagePicker.openPicker({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').width * (3 / 4),
      cropperToolbarTitle: 'Move and Scale',
      cropping: true
    }).then(image => {
      this.props.handleChangeImage({
        uri: image.path,
        type: image.mime,
        name: image.filename || `${shortid()}.${image.mime === 'image/jpeg' ? 'JPG' : 'PNG'}`
      });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <Animated.ScrollView
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="always"
      >
        <View style={styles.centerItems}>
          <ClickableImage
            width={Dimensions.get('window').width}
            height={Dimensions.get('window').width * (3 / 4)}
            onPress={this.showActionSheet}
            type="none"
            image={this.props.image}
          />
          <Input
            placeholder="Name"
            value={this.props.name}
            onChangeText={this.props.handleChangeName}
            showBorder={this.props.error.type === 'name'}
          />
          <MultiLineInput
            width={Dimensions.get('window').width - 40}
            height={200}
            placeholder="Description"
            value={this.props.description}
            onChangeText={this.props.handleChangeDescription}
            showBorder={this.props.error.type === 'description'}
            borderColor="red"
          />
          <Text style={textStyles.errorTextStyle}>{this.props.error.msg}</Text>
          <ActionSheet
            ref={this.ref}
            options={
              this.props.image ?
              ['Take Photo', 'Choose from Library', 'Remove Photo', 'Cancel'] :
              ['Take Photo', 'Choose from Library', 'Cancel']
            }
            cancelButtonIndex={this.props.image ? 3 : 2}
            destructiveButtonIndex={this.props.image ? 2 : undefined}
            onPress={this.onPressAction}
          />
        </View>
      </Animated.ScrollView>
    );
  }
}

CreateTopicScreen.propTypes = {
  handleChangeName: PropTypes.func.isRequired,
  handleChangeDescription: PropTypes.func.isRequired,
  handleChangeImage: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.object,
  error: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  centerItems: {
    flex: 1,
    alignItems: 'center'
  }
});

export default CreateTopicScreen;
