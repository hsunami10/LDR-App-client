import {
  LOG_OUT_USER,
  CREATE_TOPIC,
  START_TOPIC_LOADING,
  STOP_TOPIC_LOADING
} from '../actions/types';

const INITIAL_STATE = {
  post_topic_id: '', // Topic chosen for creating / editing post - reset this when finished
  current_topic: {},
  current_topic_subscribers: [],
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case START_TOPIC_LOADING:
      return { ...state, loading: true };
    case STOP_TOPIC_LOADING:
      return { ...state, loading: false };

    case CREATE_TOPIC: // TODO: Change this later
      return {
        ...state,
        current_topic: action.payload.topic,
        current_topic_subscribers: [action.payload.subscriber]
      };
    default:
      return state;
  }
};
