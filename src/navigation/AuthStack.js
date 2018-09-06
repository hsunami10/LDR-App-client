import { createStackNavigator } from 'react-navigation';
import {
  WelcomeScreen,
  SignUpScreen,
  LogInScreen,
  ForgotPasswordScreen
} from '../screens/auth';

// NOTE: Welcome screen does not have a regular header
export default createStackNavigator(
  {
    AuthMainStack: createStackNavigator(
      {
        Welcome: WelcomeScreen,
        AuthSubStack: createStackNavigator(
          {
            LogIn: LogInScreen,
            SignUp: SignUpScreen
          },
          {
            headerMode: 'screen'
          }
        )
      },
      {
        initialRouteName: 'Welcome',
        headerMode: 'screen'
      }
    ),
    AuthModalStack: createStackNavigator(
      {
        // NOTE: Auth modals here: forgot password, set location, camera, etc.
        ForgotPassword: ForgotPasswordScreen
      },
      {}
    )
  },
  {
    initialRouteName: 'AuthMainStack'
  }
);
