import {
  PUSH_ROUTE,
  GO_BACKWARD_ROUTE,
  POP_ROUTE,
  // REPLACE_CURRENT_ROUTE
} from './types';

export const pushRoute = routeName => ({
  type: PUSH_ROUTE,
  payload: routeName
});

// This action should only be called on navigation.goBack();
// Goes back one route
export const goBackwardRoute = () => ({ type: GO_BACKWARD_ROUTE });

// This action should only be called on navigation.pop() or navigation.popToTop();
// Needs a "pop to" route name (destination route)
// Removes all routes from the end of the array to the destination route
export const popRoute = routeName => ({
  type: POP_ROUTE,
  payload: routeName
});

// This action should only be called when navigating between tabs - DEPRECATED, use pushRoute because of android
// export const replaceCurrentRoute = routeName => ({
//   type: REPLACE_CURRENT_ROUTE,
//   payload: routeName
// });
