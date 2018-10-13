import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import shortid from 'shortid';
import {
  StandardHeader,
  ClickableImage,
  MultiLineInput,
  DismissKeyboard,
  FullScreenLoading
} from '../../components/common';
import { alertPermission, checkPermission } from '../../assets/helpers';
import { createProfile } from '../../actions/AuthActions';

// BUG: Cannot change crop rect dimension with ImagePicker

class CreateProfileScreen extends Component {
  state = { bio: '', loading: false, image: null }

  componentWillUnmount() {
    this.resetEverything();
  }

  onPressAction = index => {
    switch (index) {
      case 0:
        checkPermission('camera', this.handleCheckPermission);
        break;
      case 1:
        checkPermission('photo', this.handleCheckPermission);
        break;
      case 2:
        if (this.state.image) {
          this.setState(() => ({ image: null }));
        }
        break;
      default:
        return;
    }
  }

  resetEverything = () => this.setState(() => ({ bio: '', loading: false, image: null }))
  handleChangeText = bio => this.setState(() => ({ bio }))
  showActionSheet = () => this.ActionSheet.show()
  ref = o => (this.ActionSheet = o)

  createProfile = () => {
    Keyboard.dismiss();
    this.props.createProfile(
      {
        id: this.props.id,
        bio: this.state.bio,
        clientImage: this.state.image || null
      },
      this.props.navigation,
      this.resetEverything
    );
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
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').width,
      cropperToolbarTitle: 'Move and Scale',
      cropping: true
    }).then(image => {
      this.setState(() => ({
        image: {
          uri: image.path,
          type: image.mime,
          name: image.filename || `${shortid()}.${image.mime === 'image/jpeg' ? 'JPG' : 'PNG'}`
        }
      }));
    }).catch(err => {
      console.log(err);
    });
  }

  openPhotos = () => {
    ImagePicker.openPicker({
      // width: 300,
      // height: 300,
      cropperToolbarTitle: 'Move and Scale',
      cropping: true
    }).then(image => {
      this.setState(() => ({
        image: {
          uri: image.path,
          type: image.mime,
          name: image.filename || `${shortid()}.JPG`
        }
      }));
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
              image={this.state.image}
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
            options={
              this.state.image ?
              ['Take Photo', 'Choose from Library', 'Remove Photo', 'Cancel'] :
              ['Take Photo', 'Choose from Library', 'Cancel']
            }
            cancelButtonIndex={this.state.image ? 3 : 2}
            destructiveButtonIndex={this.state.image ? 2 : undefined}
            onPress={this.onPressAction}
          />
          <FullScreenLoading visible={this.props.loading && this.props.current_route === 'CreateProfile'} />
        </View>
      </DismissKeyboard>
    );
  }
}

CreateProfileScreen.propTypes = {
  createProfile: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  current_route: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  }
});

const mapStateToProps = state => ({
  id: state.auth.id,
  loading: state.loading,
  current_route: state.navigation.current_route
});

export default connect(mapStateToProps, { createProfile })(CreateProfileScreen);
