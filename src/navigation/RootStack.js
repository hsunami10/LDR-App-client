import { createStackNavigator } from 'react-navigation';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

export default createStackNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  },
  {
    headerMode: 'none'
  }
);
