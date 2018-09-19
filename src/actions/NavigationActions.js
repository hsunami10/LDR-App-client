import {
  NAVIGATE_TO_ROUTE,
  GO_BACKWARD_ROUTE,
  POP_ROUTE
} from './types';

// NOTE: Only add to routes array if routeName is not already in routes array
// Only called on navigation.navigate();
export const navigateToRoute = routeName => ({
  type: NAVIGATE_TO_ROUTE,
  payload: routeName
});

// NOTE: Only called on navigation.goBack();
export const goBackwardRoute = () => ({ type: GO_BACKWARD_ROUTE });

// NOTE: Only called on navigation.pop() or navigation.popToTop();
export const popRoute = routeName => ({
  type: POP_ROUTE,
  payload: routeName
});
