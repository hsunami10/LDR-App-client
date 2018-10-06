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
export const handleError = (error, custom = false) => {
  console.log(error);
  getConnectionInfo()
    .then(isConnected => {
      if (!isConnected) {
        showNoConnectionAlert();
      } else {
        Alert.alert(
            'Oops!',
            (custom ? error.message : `Fatal: ${error.message}.\n\nAn unexpected error occured. This should not have happened. A report will be sent, and we will get it fixed as soon as possible. We are sorry for the inconvenience. Please restart the app.`),
          [
            { text: 'Restart', onPress: () => RNRestart.Restart() }
          ],
          { cancelable: false }
        );
      }
    });
};

// Waits until MIN_LOADING_TIME is up (if quicker than MIN_LOADING_TIME)
export const waitUntilMinTime = (beforeReq, callback, param) => {
  const diff = Date.now() - beforeReq;
  if (diff < MIN_LOADING_TIME) {
    setTimeout(
      () => callback(param),
      MIN_LOADING_TIME - diff
    );
  } else {
    callback(param);
  }
};

export const showNoUserAlert = () => {
  Alert.alert(
    'User does not exist',
    'This account, for some reason, does not exist. If this continues, please report this bug to the development team.',
    [{ text: 'Ok' }],
    { cancelable: false }
  );
};

// ========================================== Connection ==========================================
export const showNoConnectionAlert = () => {
  Alert.alert(
    'Oh no!',
    'You do not have internet connection. Please connect to the internet and try again.',
    [
      { text: 'Ok', style: 'cancel' },
      { text: 'Restart', onPress: () => RNRestart.Restart() }
    ]
  );
};

export const getConnectionInfo = async () => {
  if (Platform.OS === 'ios') {
    return new Promise((resolve, reject) => {
      const connectionHandler = connectionInfo => {
        NetInfo.removeEventListener('connectionChange', connectionHandler);
        resolve(connectionInfo);
      };
      NetInfo.addEventListener('connectionChange', connectionHandler);
    });
  }

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
// Checks for spaces and empty strings
export const isValidInput = input => {
  if (input instanceof Array) {
    for (let i = 0, len = input.length; i < len; ++i) {
      if (!input[i].trim()) return false;
      if (input[i].trim().includes(' ')) return false;
    }
    return true;
  } else if (input instanceof String) {
    return input.trim();
  }
  return false;
};

// Checks for valid email format
export const isValidEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
