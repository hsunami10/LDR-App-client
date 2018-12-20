import { AppRegistry } from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './src/reducers';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

const middlewares = [ReduxThunk];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

// Parameters: reducers, initial state, store enhancers (middleware)
// Only initialize store once - so do it here and export, not in App.js
export default createStore(reducers, {}, applyMiddleware(...middlewares));
