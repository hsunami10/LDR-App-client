import {
  LOG_OUT_USER,
  CREATE_TOPIC,
  START_TOPIC_LOADING,
  STOP_TOPIC_LOADING,
  CHOOSE_POST_TOPIC,
  GET_SUBSCRIBED_TOPICS
} from '../actions/types';

const INITIAL_STATE = {
  post_topic: { // Topic chosen for creating / editing post
    id: '',
    name: ''
  },
  subscribed: [], // List of objects (subcribed topics)
  sub_fetched: false, // Flags unnecessary fetches
  current_topic: {}, // NOTE: Might have to put it in ScreenReducer, because can have multiple screens of different / same topics w/ diff data
  loading: false // For refreshing current topic screen
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case START_TOPIC_LOADING:
      return { ...state, loading: true };
    case STOP_TOPIC_LOADING:
      return { ...state, loading: false };

    case GET_SUBSCRIBED_TOPICS:
      return { ...state, subscribed: action.payload, sub_fetched: true };

    case CREATE_TOPIC: // TODO: Change this later
      return {
        ...state,
        current_topic: action.payload.topic,
        current_topic_subscribers: [action.payload.subscriber]
      };
    case CHOOSE_POST_TOPIC:
      return { ...state, post_topic: action.payload };
    default:
      return state;
  }
};
