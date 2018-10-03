import { createStackNavigator } from 'react-navigation';
import MainScreen from '../screens/app/MainScreen';
import ViewProfileScreen from '../screens/app/profile/ViewProfileScreen';
import ViewPostScreen from '../screens/app/social/ViewPostScreen';
import CreateMainScreen from '../screens/app/create/CreateMainScreen';
import ChooseTopicScreen from '../screens/app/create/ChooseTopicScreen';

/*
// NOTE: Structure
initialRouteName - component with react-native-tab-view
Component with react-native-tab-view - set TabView props swipeEnabled={false}
When "create" is clicked (middle tab), animate a dim screen opacity a view from below

TODO: Finish navigation organization

NOTE: Navigate directly between nested stacks:
https://www.google.com/search?q=navigate+betweeen+nested+stacks+react+navigation&oq=navigate+betweeen+nested+stacks+react+navigation&aqs=chrome..69i57.7375j0j1&sourceid=chrome&ie=UTF-8
https://stackoverflow.com/questions/49826920/how-to-navigate-between-different-nested-stacks-in-react-navigation
// QUESTION: How to pop off multiple stacks?

mode: card, modal
headerMode: float, screen, none

NOTE: Do this first, check UX, if tolerable, then keep it
ONLY 2 TRANSITIONS: MODAL AND HEADER SCREEN
export STACK (
  SUB_STACK (
    react-native-tab-view screen,
    SUB2_STACK ( screen1, screen2, ... ) ----- for different height header card transitions

    mode: 'card',
    headerMode: 'screen'
  ),
  MODAL_STACK ( modal1, modal2, ... ) ----- for modal transitions

  mode: 'modal'
)

3 TRANSITIONS: MODAL, SCREEN, FLOAT
export STACK (
  SUB_STACK (
    SUB2_STACK (
      react-native-tab-view screen,
      SUB3_STACK ( screen1, screen2, ... ) ----- for different height header card transitions

      mode: 'card',
      headerMode: 'screen'
    ),
    SUB21_STACK ( screen1, screen2, ... ) ----- for same height header card transitions

    mode: 'card',
    headerMode: 'float'
  ),
  MODAL_STACK ( modal1, modal2, ... ) ----- for modal transitions

  mode: 'modal'
)
*/

const CardStack = createStackNavigator(
  {
    // NOTE: Other screens with card transitions here
    ViewPost: ViewPostScreen
  },
  {
    headerMode: 'none'
  }
);

const MainStack = createStackNavigator(
  {
    Main: {
      screen: MainScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    AppCardStack: CardStack
  },
  {
    initialRouteName: 'Main',
    mode: 'card',
    headerMode: 'none'
  }
);

const ModalModalStack = createStackNavigator(
  {
     // NOTE: Modals in first stack of modals here
    ChooseTopic: ChooseTopicScreen
  },
  {
    headerMode: 'none'
  }
);

// BUG: ViewProfile is still pushed onto the stack when Create is navigated to?
// Shown by swiping back on CreateMainScreen
// Maybe have each modal be in its own stack, instead of multiple modals in one stack
// Because one it reaches the top of the stack, you can no longer swipe back, you have to swipe down
const ModalStack = createStackNavigator(
  {
    // NOTE: Modals here
    ViewProfile: ViewProfileScreen,
    Create: CreateMainScreen
  },
  {
    headerMode: 'none'
  }
);

// NOTE: Feed as default
// NOTE: // TODO: Remember to set header: null in static navigationOptions when needed
export default createStackNavigator(
  {
    AppMainStack: MainStack,
    AppModalStack: ModalStack,
    SubModalStack: ModalModalStack
  },
  {
    initialRouteName: 'AppMainStack',
    mode: 'modal',
    headerMode: 'none'
  }
);
