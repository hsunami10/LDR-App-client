import {
  NAVIGATE_TO_ROUTE,
  GO_BACKWARD_ROUTE,
  POP_ROUTE
} from './types';

// TODO: Navigate with these actions instead of having a this.props.navigation call every time

// NOTE: Only add to routes array if routeName is not already in routes array
// Only called on navigation.navigate();
export const navigateToRoute = routeName => ({
  type: NAVIGATE_TO_ROUTE,
  payload: routeName
});

// NOTE: Only called on navigation.goBack();
// Goes back one route
export const goBackwardRoute = () => ({ type: GO_BACKWARD_ROUTE });

// NOTE: Only called on navigation.pop() or navigation.popToTop();
// Needs a "pop to" route name (destination route)
export const popRoute = routeName => ({
  type: POP_ROUTE,
  payload: routeName
});
