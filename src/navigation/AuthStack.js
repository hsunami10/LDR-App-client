import { createStackNavigator } from 'react-navigation';
import {
  WelcomeScreen,
  SignUpScreen,
  LogInScreen,
  ForgotPasswordScreen
} from '../screens/auth';

const MainStack = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    LogIn: LogInScreen,
    SignUp: SignUpScreen
  },
  {
    initialRouteName: 'Welcome',
    headerMode: 'screen'
  }
);

// NOTE: Auth modals here: forgot password, set location, camera, etc.
const ModalStack = createStackNavigator(
  {
    ForgotPassword: ForgotPasswordScreen
  },
  {}
);

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
