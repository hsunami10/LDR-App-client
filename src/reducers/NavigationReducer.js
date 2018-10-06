import {
  PUSH_ROUTE,
  GO_BACKWARD_ROUTE,
  POP_ROUTE,
  // REPLACE_CURRENT_ROUTE
} from '../actions/types';

const INITIAL_STATE = {
  current_route: 'AuthLoading',
  routes: ['AuthLoading']
};

export default (state = INITIAL_STATE, action) => {
  const copyRoutes = [...state.routes];
  switch (action.type) {
    case PUSH_ROUTE:
      // NOTE: This always adds the route (mainly for android hardware back button)
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
    // case REPLACE_CURRENT_ROUTE:
    //   copyRoutes[copyRoutes.length - 1] = action.payload;
    //   return {
    //     ...state,
    //     current_route: action.payload,
    //     routes: copyRoutes
    //   };
    default:
      return state;
  }
};
