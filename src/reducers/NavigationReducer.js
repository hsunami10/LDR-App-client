import {
  NAVIGATE_TO_ROUTE,
  GO_BACKWARD_ROUTE,
  POP_ROUTE
} from '../actions/types';

const INITIAL_STATE = {
  current_route: 'AuthLoading',
  routes: ['AuthLoading']
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NAVIGATE_TO_ROUTE:
      return {
        ...state,
        current_route: action.payload,
        routes: (state.routes.includes(action.payload) ?
                state.routes :
                [...state.routes, action.payload])
      };
    case GO_BACKWARD_ROUTE:
      const copyRoute = [...state.routes];
      copyRoute.pop();
      return {
        ...state,
        current_route: copyRoute[copyRoute.length - 1],
        routes: copyRoute
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
