import { Alert, NetInfo } from 'react-native';
import RNRestart from 'react-native-restart';

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
