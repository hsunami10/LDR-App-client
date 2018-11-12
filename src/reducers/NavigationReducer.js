import {
  LOG_OUT_USER,
  PUSH_ROUTE,
  GO_BACKWARD_ROUTE,
  POP_ROUTE
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
  tab_indices: {
    feed: 0,
    discover: 1,
    notifications: 3,
    profile: 4
  },
  routes: ['AuthLoading']
};

export default (state = INITIAL_STATE, action) => {
  const copyRoutes = [...state.routes];
  switch (action.type) {
    case LOG_OUT_USER:
      return {
        ...INITIAL_STATE,
        routes: [...INITIAL_STATE.routes, 'Welcome']
      };
    case PUSH_ROUTE:
      return {
        ...state,
        current_route: action.payload,
        routes: [...state.routes, action.payload]
      };
    case GO_BACKWARD_ROUTE:
      if (copyRoutes.length > 1) {
        copyRoutes.pop();
      }
      return {
        ...state,
        current_route: copyRoutes[copyRoutes.length - 1],
        routes: copyRoutes
      };
    case POP_ROUTE:
      return {
        ...state,
        current_route: action.payload,
        routes: state.routes.slice(0, state.routes.indexOf(action.payload) + 1)
      };
    default:
      return state;
  }
};
