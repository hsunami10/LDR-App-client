import {
  LOG_OUT_USER,
  DELETE_POST,

  START_SEARCH_SUGGESTIONS_LOADING,
  STOP_SEARCH_SUGGESTIONS_LOADING,
  START_SEARCH_SUGGESTIONS_REFRESHING,
  STOP_SEARCH_SUGGESTIONS_REFRESHING,
  GET_USER_SEARCHES,
  REMOVE_USER_SEARCH,
  RESET_SEARCH,
} from '../actions/types';

// NOTE: Results - exactly the same as DiscoverReducer
const INITIAL_STATE = {
  home: {
    initial_loading: false,
    refreshing: false,
    term: '', // Should be trimmed
    suggestions: {
      order: [],
      data: {}
    },
    results: {
      posts: {
        refreshing: false,
        order: [],
        keepPaging: false,
      },
      users: {
        refreshing: false,
        order: [],
        keepPaging: false,
      },
      topics: {
        refreshing: false,
        order: [],
        keepPaging: false,
      }
    }
  },
  discover: {
    initial_loading: false,
    refreshing: false,
    term: '', // Should be trimmed
    suggestions: {
      order: [],
      data: {}
    },
    results: {
      posts: {
        refreshing: false,
        order: [],
        keepPaging: false,
      },
      users: {
        refreshing: false,
        order: [],
        keepPaging: false,
      },
      topics: {
        refreshing: false,
        order: [],
        keepPaging: false,
      }
    }
  }
};

// TODO: Finish search feed and discover actions
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;
    case RESET_SEARCH:
      return {
        ...state,
        [action.payload]: INITIAL_STATE[action.payload]
      };

    case DELETE_POST:
      return state;

    case START_SEARCH_SUGGESTIONS_LOADING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          initial_loading: true
        }
      };
    case STOP_SEARCH_SUGGESTIONS_LOADING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          initial_loading: false
        }
      };
    case START_SEARCH_SUGGESTIONS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          refreshing: true
        }
      };
    case STOP_SEARCH_SUGGESTIONS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          refreshing: false
        }
      };

    case GET_USER_SEARCHES:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          suggestions: action.payload.result,
          term: action.payload.term
        }
      };
    case REMOVE_USER_SEARCH:
      const copySuggestions = { ...state[action.payload.type].suggestions };
      const index = copySuggestions.order.indexOf(action.payload.id);
      if (index >= 0) {
        copySuggestions.order.splice(index, 1);
        delete copySuggestions.data[action.payload.id];
      }
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          suggestions: copySuggestions
        }
      };
    default:
      return state;
  }
};
