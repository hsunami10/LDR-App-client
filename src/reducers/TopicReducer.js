import {
  LOG_OUT_USER,
  CREATE_TOPIC,
  START_TOPIC_LOADING,
  STOP_TOPIC_LOADING,
  CHOOSE_POST_TOPIC,
  GET_SUBSCRIBED_TOPICS
} from '../actions/types';

const INITIAL_STATE = {
  post_topic: { // NOTE: Make sure it's the same as the CreateMainScreen state
    id: '',
    name: 'Choose a Topic'
  },
  subscribed: [], // List of objects (subcribed topics)
  sub_fetched: false, // Flags unnecessary fetches
  current_topic: {}, // NOTE: Might have to put it in ScreenReducer, because can have multiple screens of different / same topics w/ diff data
  loading: false // For refreshing current topic screen
};

const sortTopicsAlpha = (t1, t2) => t1.lowercase_name.localeCompare(t2.lowercase_name); // Sort alphabetically by locale

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
        subscribed: action.payload,
        sub_fetched: true
      };

    case CREATE_TOPIC:
      // Add to subscribed topics list
      const copySub = [...state.subscribed];
      copySub.push(action.payload);
      copySub.sort(sortTopicsAlpha);
      return {
        ...state,
        subscribed: copySub
      };
    case CHOOSE_POST_TOPIC:
      return { ...state, post_topic: action.payload };
    default:
      return state;
  }
};
