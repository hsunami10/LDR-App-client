import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Dimensions, Keyboard, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import Permissions from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import shortid from 'shortid';
import {
  StandardHeader,
  ClickableImage,
  DismissKeyboard,
  FullScreenLoading,
  Input
} from '../../components/common';
import { alertPermission, checkPermission } from '../../assets/helpers';
import { createProfile } from '../../actions/AuthActions';
import { findPartnerCode, removePartnerResult, acceptResult } from '../../actions/UserActions';
import PartnerCard from '../../components/partner/PartnerCard';

// BUG: Cannot change crop rect dimension with ImagePicker
// TODO: Have a prompt to enter a partner's code
// Once that input is submitted, query database
//  - If partner is found, then show a card with success message, and user is able to click on the card to ViewProfileScreen
//  - If partner is NOT found, then show error message
class CreateProfileScreen extends Component {
  state = {
    code: '',
    loading: false, // For querying partner
    image: null
  }

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

  submitCode = () => this.props.findPartnerCode(this.state.code)
  acceptResult = () => this.props.acceptResult(this.props.id, this.props.partner_result.id)
  cancelResult = () => this.props.removePartnerResult()
  resetEverything = () => this.setState(() => ({ loading: false, image: null }))
  handleChangeText = code => this.setState(() => ({ code }))
  showActionSheet = () => this.ActionSheet.show()
  ref = o => (this.ActionSheet = o)

  createProfile = () => {
    Keyboard.dismiss();
    this.props.createProfile(
      {
        id: this.props.id,
        code: this.state.code,
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
            disableRight={this.props.loading}
          />
          <View style={styles.viewStyle}>
            <ClickableImage
              width={150}
              height={150}
              onPress={this.showActionSheet}
              type="none"
              image={this.state.image}
            />
            <Text>Have a partner?</Text>
            <Input
              placeholder="Enter the code here"
              value={this.state.code}
              onChangeText={this.handleChangeText}
            />
            <PartnerCard
              user={this.props.partner_result}
              loading={this.props.find_partner_loading}
              message={this.props.partner_error_msg}
              cancelResult={this.cancelResult}
              acceptResult={this.acceptResult}
            />
            <Button
              title="Find Partner"
              onPress={this.submitCode}
              disabled={this.props.find_partner_loading || this.state.code.trim() === ''}
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
          <FullScreenLoading loading={this.props.loading} />
        </View>
      </DismissKeyboard>
    );
  }
}

CreateProfileScreen.propTypes = {
  createProfile: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  partner_error_msg: PropTypes.string.isRequired,
  findPartnerCode: PropTypes.func.isRequired,
  find_partner_loading: PropTypes.bool.isRequired,
  removePartnerResult: PropTypes.func.isRequired,
  acceptResult: PropTypes.func.isRequired,
  partner_result: PropTypes.object,
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
  partner_error_msg: state.user.partner_error_msg,
  find_partner_loading: state.user.find_partner_loading,
  partner_result: state.user.partner_result
});

export default connect(mapStateToProps, {
  createProfile,
  findPartnerCode,
  removePartnerResult,
  acceptResult
})(CreateProfileScreen);
