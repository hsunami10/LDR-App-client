import RNRestart from 'react-native-restart';
import { getConnectionInfo, showNoConnectionAlert } from '../connection';
import { removeCredentials } from '../../../actions/AuthActions';
import { alertWithSingleAction } from '../alerts';

// NOTE: Same cases as generateMessage in server/assets/wrapper.js
// Only gets triggered on inserts or updates
const handleAction = (type, callback) => {
  switch (type) {
    case 'topics':
      break;
    case 'users':
      // NOTE: This might be bad - force restarting is bad for UX
      removeCredentials()
        .then(() => RNRestart.Restart())
        .catch(error => {
          handleError(new Error(`Unable to access keychain. ${error.message}`), false);
        });
      break;
    case 'posts':
      if (callback) {
        callback();
      }
      break;
    case 'comments':
      if (callback) {
        callback();
      }
      break;
    default:
      break;
  }
};

// TODO: Send report to development team
// TODO: Add filename and line number and custom error messages for all
export const handleError = (error, fatal, callback = null) => {
  console.log(error);
  getConnectionInfo()
    .then(connectionInfo => {
      if (connectionInfo.type === 'none') {
        showNoConnectionAlert();
      } else if (error.fk_error_msg !== undefined) {
        // Handle foreign key violation (insert, update)
        // NOTE: Same as LDR_App_server helpers/wrapper.js
        // FK violation on users is a special case - log out user by restarting app
        alertWithSingleAction(
          'Oh no!',
          error.fk_error_msg,
          () => handleAction(error.fk_error_type, callback),
          error.fk_error_type === 'users' ? 'Log Out and Restart' : 'OK',
          error.fk_error_type !== 'users'
        );
      } else if (fatal) {
        alertWithSingleAction(
          'Oops!',
          `Fatal: ${error.message}\n\nAn unexpected error occured. This should not have happened. Please send a bug report, and we will get it fixed as soon as possible. We are sorry for the inconvenience.`,
          () => RNRestart.Restart(),
          'Restart',
          false
        );
      } else {
        alertWithSingleAction(
          'Oh no!',
          `Error: ${error.message}\n\nIf this keeps recurring, please send a bug report, and we will get it fixed as soon as possible.`,
        );
      }
    });
};
