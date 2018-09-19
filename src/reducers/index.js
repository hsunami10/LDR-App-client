import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import LoadingReducer from './LoadingReducer';
import NavigationReducer from './NavigationReducer';

export default combineReducers({
  auth: AuthReducer,
  loading: LoadingReducer,
  navigation: NavigationReducer
});
