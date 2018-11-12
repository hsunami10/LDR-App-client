import {
  LOG_OUT_USER,
  PUSH_TAB_ROUTE,
  NAVIGATE_TO_ROUTE,
  GO_BACKWARD_TAB_ROUTE,
  GO_BACKWARD_ROUTE
} from '../actions/types';

/*
TODO

Need a revamp to correctly handle tab presses - MainScreen.js
More organized

Android Back Button pops to top of stack, unless it's a modal.
Handle back button like Vent or Reddit

Add:
  - current_tab - string of 'tab_indices keys'
  - object that maps from route.key to index
  - current tab - routes (4 arrays for each tab)
 */

const INITIAL_STATE = {
  current_route: 'AuthLoading',
  current_tab: '',
  past_route: '',
  tab_indices: { // For handling tab presses
    feed: {
      index: 0,
      routes: []
    },
    discover: {
      index: 1,
      routes: []
    },
    notifications: {
      index: 3,
      routes: []
    },
    profile: {
      index: 4,
      routes: []
    }
  },
  routes: [] // TODO: Remove this later
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case PUSH_TAB_ROUTE:
      const addObj = { ...state.tab_indices[action.payload.tabName] };
      if (action.payload.routeName) {
        addObj.routes.push(action.payload.routeName);
      }
      const addLen = addObj.routes.length;
      return {
        ...state,
        current_route: action.payload.routeName || (addLen > 0 ? addObj.routes[addLen - 1] : action.payload.tabName),
        current_tab: action.payload.tabName,
        past_route: state.current_route,
        tab_indices: {
          ...state.tab_indices,
          [action.payload.tabName]: addObj
        }
      };
    case GO_BACKWARD_TAB_ROUTE:
      const removeObj = { ...state.tab_indices[state.current_tab] };
      removeObj.routes.pop();
      const removeLen = removeObj.routes.length;
      return {
        ...state,
        current_route: removeLen > 0 ? removeObj.routes[removeLen - 1] : state.current_tab, // If empty array, then at root of tab stack
        past_route: state.current_route,
        tab_indices: {
          ...state.tab_indices,
          [state.current_tab]: removeObj
        }
      };

    case NAVIGATE_TO_ROUTE:
      return {
        ...state,
        current_route: action.payload,
        past_route: state.current_route
      };
    case GO_BACKWARD_ROUTE:
      return {
        ...state,
        current_route: state.past_route,
        past_route: state.current_route
      };
    default:
      return state;
  }
};
