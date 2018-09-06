import { createStackNavigator } from 'react-navigation';
import {
  WelcomeScreen,
  SignUpScreen,
  LogInScreen,
  ForgotPasswordScreen
} from '../screens/auth';

const MainSubStack = createStackNavigator(
  {
    LogIn: LogInScreen,
    SignUp: SignUpScreen
  },
  {
    headerMode: 'screen'
  }
);

const MainStack = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    AuthSubStack: MainSubStack
  },
  {
    initialRouteName: 'Welcome',
    headerMode: 'none'
  }
);

const ModalStack = createStackNavigator(
  {
    // NOTE: Auth modals here: forgot password, set location, camera, etc.
    ForgotPassword: ForgotPasswordScreen
  },
  {}
);

// NOTE: Welcome screen does not have a regular header
export default createStackNavigator(
  {
    AuthMainStack: MainStack,
    AuthModalStack: ModalStack
  },
  {
    initialRouteName: 'AuthMainStack',
    headerMode: 'none',
    mode: 'modal'
  }
);
