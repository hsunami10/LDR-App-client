import { Alert } from 'react-native';

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
