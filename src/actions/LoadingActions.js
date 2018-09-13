import {
  START_OVERLAY_LOADING,
  STOP_OVERLAY_LOADING
} from './types';

export const startLoading = () => ({
  type: START_OVERLAY_LOADING
});

export const stopLoading = () => ({
  type: STOP_OVERLAY_LOADING
});
