import {
  NAVIGATE_TO_ROUTE,
  PUSH_TAB_ROUTE,
  GO_BACKWARD_ROUTE,
  GO_BACKWARD_TAB_ROUTE,
  REPLACE_CURRENT_ROUTE
} from './types';

// Don't add routeName to tabName.routes array if routeName is null
// routeName is only null when changing tabs
export const pushTabRoute = (tabName, routeName) => ({
  type: PUSH_TAB_ROUTE,
  payload: { tabName, routeName }
});

export const goBackwardTabRoute = () => ({ type: GO_BACKWARD_TAB_ROUTE });

export const navigateToRoute = routeName => ({
  type: NAVIGATE_TO_ROUTE,
  payload: routeName
});

// Goes back one route
export const goBackwardRoute = () => ({ type: GO_BACKWARD_ROUTE });

// This action should only be called when navigating between tabs - DEPRECATED, use pushRoute because of android
export const replaceCurrentRoute = routeName => ({
  type: REPLACE_CURRENT_ROUTE,
  payload: routeName
});
