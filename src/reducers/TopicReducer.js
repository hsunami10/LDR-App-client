import {
  LOG_OUT_USER,
  CREATE_TOPIC,
  START_TOPIC_LOADING,
  STOP_TOPIC_LOADING,
  CHOOSE_POST_TOPIC,
  GET_SUBSCRIBED_TOPICS,
  GET_DISCOVER_TOPICS,
  SUBSCRIBE_TOPIC,
  UNSUBSCRIBE_TOPIC,
  SEARCH_TERM,
  GET_SEARCH_TOPICS,
} from '../actions/types';
import { addTopicToOrderArrayAlpha } from '../assets/helpers/sorting';

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

    case SUBSCRIBE_TOPIC:
      return {
        ...state,
        subscribed_order: addTopicToOrderArrayAlpha(state.subscribed_order, state.all_topics, state.all_topics[action.payload]),
        all_topics: {
          ...state.all_topics,
          [action.payload]: {
            ...state.all_topics[action.payload],
            type: 'just_subscribed',
            num_subscribers: parseInt(state.all_topics[action.payload].num_subscribers, 10) + 1
          }
        }
      };
    case UNSUBSCRIBE_TOPIC:
      const copyOrder = [...state.subscribed_order];
      const index = copyOrder.indexOf(action.payload);
      if (index >= 0) {
        copyOrder.splice(index, 1);
        return {
          ...state,
          subscribed_order: copyOrder,
          all_topics: {
            ...state.all_topics,
            [action.payload]: {
              ...state.all_topics[action.payload],
              type: 'not_subscribed',
              num_subscribers: parseInt(state.all_topics[action.payload].num_subscribers, 10) - 1
            }
          }
        };
      }
      return state;

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
      const copyTopics = {
        ...state.all_topics,
        [action.payload.id]: action.payload
      };
      return {
        ...state,
        subscribed_order: addTopicToOrderArrayAlpha(state.subscribed_order, copyTopics, action.payload),
        all_topics: copyTopics
      };
    case CHOOSE_POST_TOPIC:
      return { ...state, post_topic: action.payload };

    case SEARCH_TERM:
      return {
        ...state,
        all_topics: {
          ...state.all_topics,
          ...action.payload.topics.topics
        }
      };
    case GET_SEARCH_TOPICS:
      return {
        ...state,
        all_topics: {
          ...state.all_topics,
          ...action.payload.topics
        }
      };
    default:
      return state;
  }
};
