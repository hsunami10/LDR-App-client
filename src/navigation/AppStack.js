import { createStackNavigator } from 'react-navigation';
import MainScreen from '../screens/app/MainScreen';
// import ViewPostScreen from '../screens/app/post/ViewPostScreen';
import CreateMainScreen from '../screens/app/create/CreateMainScreen';
import ChooseTopicScreen from '../screens/app/create/ChooseTopicScreen';
import EditProfileScreen from '../screens/app/profile/EditProfileScreen';
import EditPostScreen from '../screens/app/post/EditPostScreen';

const MainStack = createStackNavigator(
  {
    Main: MainScreen,
    // ViewPost: ViewPostScreen
  },
  {
    initialRouteName: 'Main',
    mode: 'card',
    headerMode: 'none'
  }
);

// NOTE: Feed as default
// NOTE: // TODO: Remember to set header: null in static navigationOptions when needed
export default createStackNavigator(
  {
    AppMainStack: {
      screen: MainStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },

    // Modals
    EditProfile: EditProfileScreen,
    Create: {
      screen: CreateMainScreen,
      navigationOptions: {
        gesturesEnabled: true
      }
    },
    ChooseTopic: ChooseTopicScreen,
    EditPost: EditPostScreen
  },
  {
    initialRouteName: 'AppMainStack',
    mode: 'modal',
    headerMode: 'none'
  }
);
