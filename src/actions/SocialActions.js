import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import {
  START_INITIAL_SOCIAL_LOADING,
  STOP_INITIAL_SOCIAL_LOADING,
  START_SOCIAL_REFRESHING,
  STOP_SOCIAL_REFRESHING,
  GET_SOCIAL_INFO,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { navigateToRoute, pushTabRoute } from './NavigationActions';
import { handleError } from '../assets/helpers/errors';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { logOut } from '../assets/helpers/authentication';

export const startInitialSocialLoading = () => ({ type: START_INITIAL_SOCIAL_LOADING });
export const stopInitialSocialLoading = () => ({ type: STOP_INITIAL_SOCIAL_LOADING });

export const startSocialRefreshing = () => ({ type: START_SOCIAL_REFRESHING });
export const stopSocialRefreshing = () => ({ type: STOP_SOCIAL_REFRESHING });

export const getSocialInfo = (userID, refresh, offset, navigation) => dispatch => {
  if (refresh) {
    dispatch(startSocialRefreshing());
  } else {
    dispatch(startInitialSocialLoading());
  }
  axios.get(`${ROOT_URL}/api/social/${userID}?offset=${offset}`)
    .then(response => {
      if (refresh) {
        dispatch(stopSocialRefreshing());
      } else {
        dispatch(stopInitialSocialLoading());
      }
      if (response.data.success) {
        dispatch({
          type: GET_SOCIAL_INFO,
          payload: response.data.social
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => logOut(navigation),
          'Log Out'
        );
      }
    })
    .catch(error => {
      if (refresh) {
        dispatch(stopSocialRefreshing());
      } else {
        dispatch(stopInitialSocialLoading());
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
