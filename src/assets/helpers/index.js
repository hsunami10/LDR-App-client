// NOTE: This file holds all helper functions

import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

// TODO: Send report to development team
export const handleError = error => {
  Alert.alert(
      'Oops!',
      `Fatal: ${error.message}.\n\nAn unexpected error occured. This should not have happened. A report will be sent, and we will get it fixed as soon as possible. We are sorry for the inconvenience. Please restart the app.`,
    [
      { text: 'Restart', onPress: () => RNRestart.Restart() }
    ]
  );
};

// ======================================== Authentication ========================================
// Checks for spaces and empty strings
export const isValidInput = input => {
  if (input instanceof Array) {
    for (let i = 0, len = input.length; i < len; ++i) {
      if (!input[i].trim()) return false;
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
