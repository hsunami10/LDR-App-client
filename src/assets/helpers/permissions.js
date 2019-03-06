import { Platform, Alert } from 'react-native';
import Permissions from 'react-native-permissions';
import { alertWithSingleAction } from './alerts';

// NOTE: This file is for helper functions for permissions
const alertRestrictedPermission = () => {
  if (Platform.OS === 'ios') {
    alertWithSingleAction(
      'Your access has been restricted.',
      'This feature is either not supported by this device or blocked by parental controls.'
    );
  }
};
/**
 * This function checks permission statuses.
 * @param  {string}   type              The current status of the specified permission type.
 *                                      Values: 'authorized', 'denied', 'restricted', 'undetermined'.
 * @callback          responseCallback  The function to be called with the type and response string.
 *                                      Values: 'authorized', 'denied', 'restricted', 'undetermined'.
 */
export const checkPermission = (type, responseCallback) => {
  Permissions.check(type)
    .then(response => responseCallback(type, response));
};
/**
 * This function handles all alerts for all permission types in the app.
 * @param  {string} permissionStatus          The status of the permission.
 *                                            Values: 'authorized', 'denied', 'restricted', 'undetermined'.
 * @callback        requestPermissionCallback The function that requests for permission if this alert is accepted.
 *                                            This function takes in a "type" parameter.
 * @param  {string} type                      The type of permission.
 */
export const alertPermission = (permissionStatus, requestPermissionCallback, type) => {
  let title = '';
  let msg = '';
  switch (type) {
    case 'camera':
      title = 'Can we access your camera?';
      msg = 'We need access so you can take pictures for your profile picture and topic images.';
      break;
    case 'location':
      title = 'Can we access your location?';
      msg = 'We need access so you can find posts near you.';
      break;
    case 'notification':
      title = 'Can we send you notifications?';
      msg = 'You may like notifications for subscribed topics and users.';
      break;
    case 'photo':
      title = 'Can we access your photos?';
      msg = 'We need access so you can set your profile picture and choose topic images.';
      break;
    default:
      return;
  }
  if (permissionStatus === 'denied' || permissionStatus === 'undetermined') {
    // NOTE: Only ask for notification permissions if haven't asked before
    if (permissionStatus === 'denied' && type === 'notification') return;
    Alert.alert(
      title,
      msg,
      [
        { text: 'Cancel', style: 'cancel' },
        permissionStatus === 'undetermined' ?
        { text: 'OK', onPress: () => requestPermissionCallback(type) } :
        { text: 'Go to Settings', onPress: Permissions.openSettings }
      ]
    );
  } else if (permissionStatus === 'restricted') {
    alertRestrictedPermission();
  }
};
