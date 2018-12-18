import {
  LOG_OUT_USER,
  DELETE_POST,
  START_INITIAL_DISCOVER_POSTS_LOADING,
  STOP_INITIAL_DISCOVER_POSTS_LOADING,
  START_DISCOVER_POSTS_REFRESHING,
  STOP_DISCOVER_POSTS_REFRESHING,
  START_INITIAL_DISCOVER_USERS_LOADING,
  STOP_INITIAL_DISCOVER_USERS_LOADING,
  START_DISCOVER_USERS_REFRESHING,
  STOP_DISCOVER_USERS_REFRESHING,
  START_INITIAL_DISCOVER_TOPICS_LOADING,
  STOP_INITIAL_DISCOVER_TOPICS_LOADING,
  START_DISCOVER_TOPICS_REFRESHING,
  STOP_DISCOVER_TOPICS_REFRESHING,
  GET_DISCOVER_POSTS,
  GET_DISCOVER_USERS,
  GET_DISCOVER_TOPICS,
} from '../actions/types';

const INITIAL_STATE = {
  posts: {
    initial_loading: false,
    refreshing: false,
    order: [],
    keepPaging: false,
  },
  users: {
    initial_loading: false,
    refreshing: false,
    order: [],
    keepPaging: false,
  },
  topics: {
    initial_loading: false,
    refreshing: false,
    order: [],
    keepPaging: false,
  }
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case DELETE_POST:
      const copyOrder = [...state.posts.order];
      const index = copyOrder.indexOf(action.payload.postID);
      if (index >= 0) {
        copyOrder.splice(index, 1);
        return {
          ...state,
          posts: {
            ...state.posts,
            order: copyOrder
          }
        };
      }
      return state;
    case START_INITIAL_DISCOVER_POSTS_LOADING:
      return {
        ...state,
        posts: {
          ...state.posts,
          initial_loading: true
        }
      };
    case STOP_INITIAL_DISCOVER_POSTS_LOADING:
      return {
        ...state,
        posts: {
          ...state.posts,
          initial_loading: false
        }
      };
    case START_DISCOVER_POSTS_REFRESHING:
      return {
        ...state,
        posts: {
          ...state.posts,
          refreshing: true
        }
      };
    case STOP_DISCOVER_POSTS_REFRESHING:
      return {
        ...state,
        posts: {
          ...state.posts,
          refreshing: false
        }
      };
    case GET_DISCOVER_POSTS:
      return {
        ...state,
        posts: {
          ...state.posts,
          order: action.payload.replace ? action.payload.order : [...state.posts.order, ...action.payload.order],
          keepPaging: action.payload.order.length !== 0
        }
      };

    case START_INITIAL_DISCOVER_USERS_LOADING:
      return {
        ...state,
        users: {
          ...state.users,
          initial_loading: true
        }
      };
    case STOP_INITIAL_DISCOVER_USERS_LOADING:
      return {
        ...state,
        users: {
          ...state.users,
          initial_loading: false
        }
      };
    case START_DISCOVER_USERS_REFRESHING:
      return {
        ...state,
        users: {
          ...state.users,
          refreshing: true
        }
      };
    case STOP_DISCOVER_USERS_REFRESHING:
      return {
        ...state,
        users: {
          ...state.users,
          refreshing: false
        }
      };
    case GET_DISCOVER_USERS:
      return {
        ...state,
        users: {
          ...state.users,
          order: action.payload.replace ? action.payload.order : [...state.users.order, ...action.payload.order],
          keepPaging: action.payload.order.length !== 0
        }
      };

    case START_INITIAL_DISCOVER_TOPICS_LOADING:
      return {
        ...state,
        topics: {
          ...state.topics,
          initial_loading: true
        }
      };
    case STOP_INITIAL_DISCOVER_TOPICS_LOADING:
      return {
        ...state,
        topics: {
          ...state.topics,
          initial_loading: false
        }
      };
    case START_DISCOVER_TOPICS_REFRESHING:
      return {
        ...state,
        topics: {
          ...state.topics,
          refreshing: true
        }
      };
    case STOP_DISCOVER_TOPICS_REFRESHING:
      return {
        ...state,
        topics: {
          ...state.topics,
          refreshing: false
        }
      };
    case GET_DISCOVER_TOPICS:
      return {
        ...state,
        topics: {
          ...state.topics,
          order: action.payload.replace ? action.payload.order : [...state.topics.order, ...action.payload.order],
          keepPaging: action.payload.order.length !== 0
        }
      };

    default:
      return state;
  }
};
