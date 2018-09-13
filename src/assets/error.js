import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

const handleError = error => {
  Alert.alert(
      'Oops!',
      `Fatal: ${error.message}.\n\nAn unexpected error occured. This should not have happened. A report will be sent, and we will get it fixed as soon as possible. We are sorry for the inconvenience. Please restart the app.`,
    [
      { text: 'Restart', onPress: () => RNRestart.Restart() }
    ]
  );
};

export default handleError;
