import React, { Component } from 'react';
import { View } from 'react-native';
import { Provider } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { SafeAreaView } from 'react-navigation';
import * as Keychain from 'react-native-keychain';
import io from 'socket.io-client';
import { ROOT_URL } from './constants/variables';
import { handleError } from './assets/helpers/errors';
import configSocket from './assets/config/socket';
import RootStack from '../src/navigation/RootStack';
import store from '../index';

const socket = io(ROOT_URL);

class App extends Component {
  componentDidMount() {
    this.initSocketConnection();
    configSocket(socket);
  }

  initSocketConnection = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        socket.emit('initialize-connection', credentials.username);
      }
    } catch (e) {
      handleError(new Error(`Unable to access keychain. ${e.message}`), true);
    }
  }

  render() {
    if (isIphoneX()) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Provider store={store}>
            <RootStack screenProps={{ socket }} />
          </Provider>
        </SafeAreaView>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Provider store={store}>
          <RootStack screenProps={{ socket }} />
        </Provider>
      </View>
    );
  }
}

export default App;
