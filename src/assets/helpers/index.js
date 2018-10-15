// NOTE: This file holds all helper functions
import { Alert, NetInfo, Platform } from 'react-native';
import RNRestart from 'react-native-restart';
import Permissions from 'react-native-permissions';
import { MIN_LOADING_TIME } from '../../constants/variables';

export const atBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  if (contentOffset.y < 0) {
    console.log('content smaller than view');
  }
  return layoutMeasurement.height + contentOffset.y >= contentSize.height && contentOffset.y > 0;
};

// TODO: Send report to development team
export const handleError = (error, fatal) => {
  console.log(error);
  getConnectionInfo()
    .then(connectionInfo => {
      if (connectionInfo.type === 'none') {
        showNoConnectionAlert();
      } else if (error.fk_error_msg) {
        Alert.alert(
            'Oh no!',
            error.fk_error_msg,
          [
            { text: 'OK' }
          ]
        );
      } else if (fatal) {
        Alert.alert(
            'Oops!',
            `Fatal: ${error.message}\n\nAn unexpected error occured. This should not have happened. Please send a bug report, and we will get it fixed as soon as possible. We are sorry for the inconvenience.`,
          [{ text: 'Restart', onPress: () => RNRestart.Restart() }],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          'Oh no!',
          `Error: ${error.message}\n\nIf this keeps recurring, please send a bug report, and we will get it fixed as soon as possible.`,
          [{ text: 'OK' }]
        );
      }
    });
};

export const showNoUserAlert = () => {
  Alert.alert(
    'User does not exist',
    'This account has been deleted. If this is not supposed to happen, please report this bug to the development team.',
    [{ text: 'Ok' }],
    { cancelable: false }
  );
};

// ========================================== Connection ==========================================
export const showNoConnectionAlert = () => {
  Alert.alert(
    'No Internet',
    'You do not have internet connection. Please connect to the internet and try again.',
    [
      { text: 'Ok', style: 'cancel' },
      { text: 'Restart', onPress: () => RNRestart.Restart() }
    ]
  );
};

export const getConnectionInfo = async () => {
  // QUESTION: Should this be uncommented? Removing and adding causes double error handling (multiple overlapping alerts)
  // if (Platform.OS === 'ios') {
  //   return new Promise((resolve, reject) => {
  //     const connectionHandler = connectionInfo => {
  //       NetInfo.removeEventListener('connectionChange', connectionHandler);
  //       resolve(connectionInfo);
  //     };
  //     NetInfo.addEventListener('connectionChange', connectionHandler);
  //   });
  // }

  return NetInfo.getConnectionInfo();
};

// ========================================= Permissions =========================================
const alertRestrictedPermission = () => {
  if (Platform.OS === 'ios') {
    Alert.alert(
      'Your access has been restricted.',
      'This feature is either not supported by this device or blocked by parental controls.',
      [{ text: 'OK' }]
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
      msg = 'We need access so you can find posts near you and update your partner.';
      break;
    case 'notification':
      title = 'Can we send you notifications?';
      msg = 'You may like notifications for subscribed topics and users, and updates on your partner.';
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

// ======================================== Authentication ========================================
export const isValidCredentials = arr => {
  let msg = '';
  let type = '';
  let index = 0;
  for (let i = 0, len = arr.length; i < len; i++) {
    index = i;
    if (hasTrailingSpaces(arr[i])) msg = 'No trailing spaces';
    if (arr[i].trim().includes(' ')) msg = 'Cannot have spaces between characters';
    if (arr[i].length === 0) msg = 'Invalid username or password';
    if (msg.length > 0) break;
  }
  if (index === 0) type = 'username';
  else type = 'password';
  return {
    status: msg.length === 0,
    type: msg.includes('username') && msg.includes('password') ? '' : type,
    msg
  };
};

export const hasTrailingSpaces = input => {
  if (input instanceof Array) {
    for (let i = 0, len = input.length; i < len; i++) {
      if (input[i].trim().length !== input[i].length) return true;
    }
  } else if (typeof input === 'string') {
    return input.trim().length !== input.length;
  }
  return false;
};

// Checks for empty strings, only spaces strings, trailing spaces
export const isValidName = input => {
  return input.trim() !== '' && !hasTrailingSpaces(input);
};

// Checks for valid email format
export const isValidEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
