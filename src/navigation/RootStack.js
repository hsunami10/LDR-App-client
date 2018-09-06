// NOTE: This file combines all of the different routes and exports the root navigator
import { createStackNavigator } from 'react-navigation';
import { FadeScreenTransition } from './transitions';
import AuthLoadingScreen from '../screens/auth/AuthLoadingScreen';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const FadeNavigationConfig = () => ({
  screenInterpolator: sceneProps => {
      const { scene, position } = sceneProps;
      const index = scene.index;
      return FadeScreenTransition(index, position);
    }
});

const RootStack = createStackNavigator(
  {
    Auth: AuthStack,
    App: AppStack
  },
  {
    headerMode: 'none'
  }
);

// NOTE: Splash Screen to other screens
// This shows the splash screen when determining
// whether the user is already logged in on this device
// Uses the "fade screen" transition
export default createStackNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    Root: RootStack
  },
  {
    initialRouteName: 'AuthLoading',
    headerMode: 'none',
    transitionConfig: FadeNavigationConfig
  }
);
