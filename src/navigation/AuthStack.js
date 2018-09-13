import { createStackNavigator } from 'react-navigation';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LogInScreen from '../screens/auth/LogInScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import CreateProfileScreen from '../screens/auth/CreateProfileScreen';

const AfterInputStack = createStackNavigator(
  {
    CreateProfile: CreateProfileScreen
  },
  {
    initialRouteName: 'CreateProfile',
    headerMode: 'none'
  }
);

const MainStack = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    LogIn: LogInScreen,
    SignUp: SignUpScreen,
    AfterInput: AfterInputStack
  },
  {
    initialRouteName: 'Welcome',
    headerMode: 'none'
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
