import {
  LOG_OUT_USER,
  START_INITIAL_SOCIAL_LOADING,
  STOP_INITIAL_SOCIAL_LOADING,
  START_SOCIAL_REFRESHING,
  STOP_SOCIAL_REFRESHING,
  GET_SOCIAL_INFO,
  GET_USER_FRIENDS,
  REMOVE_FRIEND_REQUEST,
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  REJECT_FRIEND_REQUEST,
  REMOVE_PENDING_REQUEST,
  CANCEL_PENDING_REQUEST,
  REMOVE_FRIEND,
  UNFRIEND_USER,
  GET_DISCOVER_USERS,
  SEARCH_TERM,
  GET_SEARCH_USERS,
  DELETE_USER,
} from '../actions/types';

const INITIAL_STATE = {
  initial_loading: false,
  refreshing: false,
  requests: {
    order: []
  },
  pending: {
    order: []
  },
  friends: {
    order: [],
    keepPaging: false,
    replace: true
  },
  all_users: {}
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;
    case START_INITIAL_SOCIAL_LOADING:
      return { ...state, initial_loading: true };
    case STOP_INITIAL_SOCIAL_LOADING:
      return { ...state, initial_loading: false };
    case START_SOCIAL_REFRESHING:
      return { ...state, refreshing: true };
    case STOP_SOCIAL_REFRESHING:
      return { ...state, refreshing: false };

    case DELETE_USER:
      const copyAllUsers = { ...state.all_users };
      delete copyAllUsers[action.payload];
      return { ...state, all_users: copyAllUsers };

    case GET_SOCIAL_INFO:
      return {
        ...state,
        ...action.payload,
        all_users: {
          ...state.all_users,
          ...action.payload.all_users
        }
      };
    case GET_USER_FRIENDS:
      return {
        ...state,
        friends: {
          ...state.friends,
          order: action.payload.replace ? action.payload.order : [...state.friends.order, ...action.payload.order],
          keepPaging: action.payload.keepPaging
        },
        all_users: {
          ...state.all_users,
          ...action.payload.friends
        }
      };

    case REMOVE_FRIEND_REQUEST:
      const copyUsers = { ...state.all_users };
      const copyRequests = { ...state.requests };
      const index = copyRequests.order.indexOf(action.payload);
      if (index >= 0) {
        copyRequests.order.splice(index, 1);
        delete copyUsers[action.payload];
        return {
          ...state,
          requests: copyRequests,
          all_users: copyUsers
        };
      }
      return state;
    case SEND_FRIEND_REQUEST:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          [action.payload]: {
            ...state.all_users[action.payload],
            type: 'pending'
          }
        }
      };
    case ACCEPT_FRIEND_REQUEST:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          [action.payload]: {
            ...state.all_users[action.payload],
            type: 'friend'
          }
        }
      };
    case REJECT_FRIEND_REQUEST:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          [action.payload]: {
            ...state.all_users[action.payload],
            type: 'regular'
          }
        }
      };

    case REMOVE_PENDING_REQUEST:
      const copyUsers1 = { ...state.all_users };
      const copyPending = { ...state.pending };
      const index1 = copyPending.order.indexOf(action.payload);
      if (index1 >= 0) {
        copyPending.order.splice(index1, 1);
        delete copyUsers1[action.payload];
        return {
          ...state,
          pending: copyPending,
          all_users: copyUsers1
        };
      }
      return state;
    case CANCEL_PENDING_REQUEST:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          [action.payload]: {
            ...state.all_users[action.payload],
            type: 'regular'
          }
        }
      };

    case REMOVE_FRIEND:
      const copyUsers2 = { ...state.all_users };
      const copyFriends = { ...state.friends };
      const index2 = copyFriends.order.indexOf(action.payload);
      if (index2 >= 0) {
        copyFriends.order.splice(index2, 1);
        delete copyUsers2[action.payload];
        return {
          ...state,
          pending: copyFriends,
          all_users: copyUsers2
        };
      }
      return state;
    case UNFRIEND_USER:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          [action.payload]: {
            ...state.all_users[action.payload],
            type: 'regular'
          }
        }
      };

    case GET_DISCOVER_USERS:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          ...action.payload.users
        }
      };

    case SEARCH_TERM:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          ...action.payload.users.users,
        }
      };
    case GET_SEARCH_USERS:
      return {
        ...state,
        all_users: {
          ...state.all_users,
          ...action.payload.users
        }
      };
    default:
      return state;
  }
};
