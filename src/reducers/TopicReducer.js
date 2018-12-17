import {
  LOG_OUT_USER,
  CREATE_TOPIC,
  START_TOPIC_LOADING,
  STOP_TOPIC_LOADING,
  CHOOSE_POST_TOPIC,
  GET_SUBSCRIBED_TOPICS,
  GET_DISCOVER_TOPICS,
} from '../actions/types';
import { sortTopicsAlpha } from '../assets/helpers/sorting';

const INITIAL_STATE = {
  post_topic: { // NOTE: Make sure it's the same as the CreateMainScreen state
    id: '',
    name: 'Choose a Topic'
  },
  subscribed_order: [], // List of topic ids (subcribed topics)
  current_topic: {}, // NOTE: Might have to put it in ScreenReducer, because can have multiple screens of different / same topics w/ diff data
  loading: false, // For refreshing current topic screen
  refreshing: false,
  all_topics: {}
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
      return {
        ...state,
        subscribed_order: action.payload.order,
        all_topics: {
          ...state.all_topics,
          ...action.payload.data
        }
      };
    case GET_DISCOVER_TOPICS:
      return {
        ...state,
        all_topics: {
          ...state.all_topics,
          ...action.payload.topics
        }
      };

    case CREATE_TOPIC:
      // Add to subscribed topics list
      const copySub = [...state.subscribed];
      copySub.push(action.payload);
      copySub.sort(sortTopicsAlpha);
      return { ...state, subscribed: copySub };
    case CHOOSE_POST_TOPIC:
      return { ...state, post_topic: action.payload };
    default:
      return state;
  }
};
