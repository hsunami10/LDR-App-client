import axios from 'axios';
import {
  START_SEARCH_SUGGESTIONS_LOADING,
  STOP_SEARCH_SUGGESTIONS_LOADING,
  START_SEARCH_SUGGESTIONS_REFRESHING,
  STOP_SEARCH_SUGGESTIONS_REFRESHING,
  GET_USER_SEARCHES,
  REMOVE_USER_SEARCH,
  RESET_SEARCH,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { handleError } from '../assets/helpers/errors';

export const resetSearch = type => ({ type: RESET_SEARCH, payload: type });

// type - 'home', 'discover'
export const searchTerm = (type, id, term) => dispatch => {
  // TODO: Finish this later
  console.log('search up term: ' + term);
};

// ========================================= Suggestions =========================================
export const startSearchSuggestionsLoading = type => ({ type: START_SEARCH_SUGGESTIONS_LOADING, payload: type });
export const stopSearchSuggestionsLoading = type => ({ type: STOP_SEARCH_SUGGESTIONS_LOADING, payload: type });

export const startSearchSuggestionsRefreshing = type => ({ type: START_SEARCH_SUGGESTIONS_REFRESHING, payload: type });
export const stopSearchSuggestionsRefreshing = type => ({ type: STOP_SEARCH_SUGGESTIONS_REFRESHING, payload: type });

export const getUserSearches = (id, term, refresh, type) => dispatch => {
  if (refresh === true) {
    dispatch(startSearchSuggestionsRefreshing(type));
  } else if (refresh === false) {
    dispatch(startSearchSuggestionsLoading(type));
  }
  axios.get(`${ROOT_URL}/api/search/get-user-searches/${id}?term=${term}`)
    .then(response => {
      if (refresh === true) {
        dispatch(stopSearchSuggestionsRefreshing(type));
      } else if (refresh === false) {
        dispatch(stopSearchSuggestionsLoading(type));
      }
      dispatch({
        type: GET_USER_SEARCHES,
        payload: {
          result: response.data,
          term,
          type
        }
      });
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopSearchSuggestionsRefreshing(type));
      } else if (refresh === false) {
        dispatch(stopSearchSuggestionsLoading(type));
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

export const removeUserSearch = (type, id) => dispatch => {
  dispatch({
    type: REMOVE_USER_SEARCH,
    payload: { id, type }
  });
  axios.delete(`${ROOT_URL}/api/search/remove-user-search/${id}`)
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};
