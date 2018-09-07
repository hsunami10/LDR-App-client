import { createStackNavigator } from 'react-navigation';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LogInScreen from '../screens/auth/LogInScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

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
