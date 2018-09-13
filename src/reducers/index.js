import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import LoadingReducer from './LoadingReducer';

export default combineReducers({
  auth: AuthReducer,
  loading: LoadingReducer
});
