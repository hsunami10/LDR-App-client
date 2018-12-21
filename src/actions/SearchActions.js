import axios from 'axios';
import {
  START_SEARCH_SUGGESTIONS_LOADING,
  STOP_SEARCH_SUGGESTIONS_LOADING,
  START_SEARCH_SUGGESTIONS_REFRESHING,
  STOP_SEARCH_SUGGESTIONS_REFRESHING,
  START_SEARCH_POSTS_REFRESHING,
  STOP_SEARCH_POSTS_REFRESHING,
  START_SEARCH_USERS_REFRESHING,
  STOP_SEARCH_USERS_REFRESHING,
  START_SEARCH_TOPICS_REFRESHING,
  STOP_SEARCH_TOPICS_REFRESHING,
  START_SEARCH_LOADING,
  STOP_SEARCH_LOADING,
  SEARCH_TERM,
  GET_USER_SEARCHES,
  REMOVE_USER_SEARCH,
  RESET_SEARCH,
  SHOW_RESULT_TABS,
  GET_SEARCH_POSTS,
  GET_SEARCH_USERS,
  GET_SEARCH_TOPICS,
} from './types';
import { ROOT_URL } from '../constants/variables';
import { alertWithSingleAction } from '../assets/helpers/alerts';
import { logOut } from '../assets/helpers/authentication';
import { handleError } from '../assets/helpers/errors';

export const resetSearch = type => ({ type: RESET_SEARCH, payload: type });

export const showResultTabs = (type, showTabs) => ({
  type: SHOW_RESULT_TABS,
  payload: { type, showTabs }
});

// ======================================== Search Results ========================================
export const startSearchLoading = type => ({ type: START_SEARCH_LOADING, payload: type });
export const stopSearchLoading = type => ({ type: STOP_SEARCH_LOADING, payload: type });

// type - 'home', 'discover'
export const searchTerm = (type, userID, term, navigation) => dispatch => {
  dispatch(showResultTabs(type, true));
  dispatch(startSearchLoading(type));
  axios.get(`${ROOT_URL}/api/search/search-term/${userID}?term=${term}`)
    .then(response => {
      dispatch(stopSearchLoading(type));
      if (response.data.success) {
        dispatch({
          type: SEARCH_TERM,
          payload: {
            type,
            term,
            ...response.data.result
          }
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => dispatch(logOut(navigation)),
          'Log Out'
        );
      }
    })
    .catch(error => {
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ============================================ Posts ============================================
export const startSearchPostsRefreshing = type => ({ type: START_SEARCH_POSTS_REFRESHING, payload: type });
export const stopSearchPostsRefreshing = type => ({ type: STOP_SEARCH_POSTS_REFRESHING, payload: type });

export const getSearchPosts = (userID, type, term, refresh, order, direction, lastID, lastData, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startSearchPostsRefreshing(type));
  }
  axios.get(`${ROOT_URL}/api/search/get-posts/${userID}?term=${term}&order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`)
    .then(response => {
      if (refresh === true) {
        dispatch(stopSearchPostsRefreshing(type));
      }
      if (response.data.success) {
        dispatch({
          type: GET_SEARCH_POSTS,
          payload: {
            type,
            ...response.data.posts
          }
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => dispatch(logOut(navigation)),
          'Log Out'
        );
      }
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopSearchPostsRefreshing(type));
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ============================================ Users ============================================
export const startSearchUsersRefreshing = type => ({ type: START_SEARCH_USERS_REFRESHING, payload: type });
export const stopSearchUsersRefreshing = type => ({ type: STOP_SEARCH_USERS_REFRESHING, payload: type });

export const getSearchUsers = (userID, type, term, refresh, order, direction, lastID, lastData, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startSearchUsersRefreshing(type));
  }
  axios.get(`${ROOT_URL}/api/search/get-users/${userID}?term=${term}&order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`)
    .then(response => {
      if (refresh === true) {
        dispatch(stopSearchUsersRefreshing(type));
      }
      if (response.data.success) {
        dispatch({
          type: GET_SEARCH_USERS,
          payload: {
            type,
            ...response.data.users
          }
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => dispatch(logOut(navigation)),
          'Log Out'
        );
      }
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopSearchUsersRefreshing(type));
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
};

// ============================================ Topics ============================================
export const startSearchTopicsRefreshing = type => ({ type: START_SEARCH_TOPICS_REFRESHING, payload: type });
export const stopSearchTopicsRefreshing = type => ({ type: STOP_SEARCH_TOPICS_REFRESHING, payload: type });

export const getSearchTopics = (userID, type, term, refresh, order, direction, lastID, lastData, navigation) => dispatch => {
  if (refresh === true) {
    dispatch(startSearchTopicsRefreshing(type));
  }
  axios.get(`${ROOT_URL}/api/search/get-topics/${userID}?term=${term}&order=${order}&direction=${direction}&last_id=${lastID}&last_data=${lastData}`)
    .then(response => {
      if (refresh === true) {
        dispatch(stopSearchTopicsRefreshing(type));
      }
      if (response.data.success) {
        dispatch({
          type: GET_SEARCH_TOPICS,
          payload: {
            type,
            ...response.data.topics
          }
        });
      } else {
        alertWithSingleAction(
          'Oh no!',
          response.data.error,
          () => dispatch(logOut(navigation)),
          'Log Out'
        );
      }
    })
    .catch(error => {
      if (refresh === true) {
        dispatch(stopSearchTopicsRefreshing(type));
      }
      if (error.response) {
        handleError(error.response.data, false);
      } else {
        handleError(error, false);
      }
    });
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
