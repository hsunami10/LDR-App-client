import {
  NAVIGATE_TO_ROUTE,
  GO_BACKWARD_ROUTE,
  POP_ROUTE,
  REPLACE_CURRENT_ROUTE
} from './types';

// This action only adds to routes array if routeName is not already in routes array
// Only called on navigation.navigate();
export const navigateToRoute = routeName => ({
  type: NAVIGATE_TO_ROUTE,
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

// This action should only be called when navigating between tabs
export const replaceCurrentRoute = routeName => ({
  type: REPLACE_CURRENT_ROUTE,
  payload: routeName
});
