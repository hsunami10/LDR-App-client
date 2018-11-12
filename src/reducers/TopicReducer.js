import {
  LOG_OUT_USER,
  CREATE_TOPIC
} from '../actions/types';

const INITIAL_STATE = {
  current_topic: {},
  current_topic_subscribers: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOG_OUT_USER:
      return INITIAL_STATE;

    case CREATE_TOPIC:
      return {
        ...state,
        current_topic: action.payload.topic,
        current_topic_subscribers: [action.payload.subscriber]
      };
    default:
      return state;
  }
};
