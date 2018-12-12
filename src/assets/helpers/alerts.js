import { Alert } from 'react-native';

// TODO: Make function that handles any number of actions - process arrays

// Alert with one confirmation option
export const alertWithSingleAction = (title, message, callback = () => undefined, actionTitle = 'OK', cancelable = true) => {
  Alert.alert(
    title,
    message,
    [{ text: actionTitle, onPress: callback }],
    {
      onDismiss: callback,
      cancelable
    }
  );
};
