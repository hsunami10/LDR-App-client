import {
  LOG_OUT_USER,
  DELETE_POST,

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
} from '../actions/types';

// NOTE: Results - exactly the same as DiscoverReducer
const INITIAL_STATE = {
  home: {
    term: '', // Should be trimmed
    showTabs: false,
    suggestions: {
      initial_loading: false,
      refreshing: false,
      order: [],
      data: {}
    },
    results: {
      initial_loading: false,
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
    term: '', // Should be trimmed
    showTabs: false,
    suggestions: {
      initial_loading: false,
      refreshing: false,
      order: [],
      data: {}
    },
    results: {
      initial_loading: false,
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
      const copyHome = { ...state.home };
      const copyDiscover = { ...state.discover };
      const index1 = copyHome.results.posts.order.indexOf(action.payload.postID);
      if (index1 >= 0) {
        copyHome.results.posts.order.splice(index1, 1);
      }
      const index2 = copyDiscover.results.posts.order.indexOf(action.payload.postID);
      if (index2 >= 0) {
        copyDiscover.results.posts.order.splice(index2, 1);
      }
      return {
        ...state,
        home: copyHome,
        discover: copyDiscover
      };

    case START_SEARCH_SUGGESTIONS_LOADING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          suggestions: {
            ...state[action.payload].suggestions,
            initial_loading: true
          }
        }
      };
    case STOP_SEARCH_SUGGESTIONS_LOADING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          suggestions: {
            ...state[action.payload].suggestions,
            initial_loading: false
          }
        }
      };
    case START_SEARCH_SUGGESTIONS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          suggestions: {
            ...state[action.payload].suggestions,
            refreshing: true
          }
        }
      };
    case STOP_SEARCH_SUGGESTIONS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          suggestions: {
            ...state[action.payload].suggestions,
            refreshing: false
          }
        }
      };
    case START_SEARCH_POSTS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            posts: {
              ...state[action.payload].results.posts,
              refreshing: true
            }
          }
        }
      };
    case STOP_SEARCH_POSTS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            posts: {
              ...state[action.payload].results.posts,
              refreshing: false
            }
          }
        }
      };
    case START_SEARCH_USERS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            users: {
              ...state[action.payload].results.users,
              refreshing: true
            }
          }
        }
      };
    case STOP_SEARCH_USERS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            users: {
              ...state[action.payload].results.users,
              refreshing: false
            }
          }
        }
      };
    case START_SEARCH_TOPICS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            topics: {
              ...state[action.payload].results.topics,
              refreshing: true
            }
          }
        }
      };
    case STOP_SEARCH_TOPICS_REFRESHING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            topics: {
              ...state[action.payload].results.topics,
              refreshing: false
            }
          }
        }
      };

    case START_SEARCH_LOADING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            initial_loading: true
          }
        }
      };
    case STOP_SEARCH_LOADING:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          results: {
            ...state[action.payload].results,
            initial_loading: false
          }
        }
      };

    case SEARCH_TERM:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          term: action.payload.term,
          results: {
            ...state[action.payload.type].results,
            users: {
              ...state[action.payload.type].results.users,
              order: action.payload.users.replace ? action.payload.users.order : [...state[action.payload.type].results.users.order, ...action.payload.users.order],
              keepPaging: action.payload.users.keepPaging
            },
            posts: {
              ...state[action.payload.type].results.posts,
              order: action.payload.posts.replace ? action.payload.posts.order : [...state[action.payload.type].results.posts.order, ...action.payload.posts.order],
              keepPaging: action.payload.posts.keepPaging
            },
            topics: {
              ...state[action.payload.type].results.topics,
              order: action.payload.topics.replace ? action.payload.topics.order : [...state[action.payload.type].results.topics.order, ...action.payload.topics.order],
              keepPaging: action.payload.topics.keepPaging
            },
          }
        }
      };
    case GET_USER_SEARCHES:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          suggestions: {
            ...state[action.payload.type].suggestions,
            ...action.payload.result
          },
          term: action.payload.term,
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
    case SHOW_RESULT_TABS:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          showTabs: action.payload.showTabs
        }
      };

    case GET_SEARCH_POSTS:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          results: {
            ...state[action.payload.type].results,
            posts: {
              ...state[action.payload.type].results.posts,
              order: action.payload.replace ? action.payload.order : [...state[action.payload.type].results.posts.order, ...action.payload.order],
              keepPaging: action.payload.keepPaging
            },
          }
        }
      };
    case GET_SEARCH_USERS:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          results: {
            ...state[action.payload.type].results,
            users: {
              ...state[action.payload.type].results.users,
              order: action.payload.replace ? action.payload.order : [...state[action.payload.type].results.users.order, ...action.payload.order],
              keepPaging: action.payload.keepPaging
            },
          }
        }
      };
    case GET_SEARCH_TOPICS:
      return {
        ...state,
        [action.payload.type]: {
          ...state[action.payload.type],
          results: {
            ...state[action.payload.type].results,
            topics: {
              ...state[action.payload.type].results.topics,
              order: action.payload.replace ? action.payload.order : [...state[action.payload.type].results.topics.order, ...action.payload.order],
              keepPaging: action.payload.keepPaging
            },
          }
        }
      };
    default:
      return state;
  }
};
