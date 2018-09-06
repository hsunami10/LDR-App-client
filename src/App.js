import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { Provider } from 'react-redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { SafeAreaView } from 'react-navigation';
import NavStack from '../src/navigation';
import store from '../index';
// import firebase from 'firebase'; // NOTE: This crashes android emulator

const instructions = Platform.select({
  ios: 'Welcome, iOS!',
  android: 'Welcome, Android!'
});

class App extends Component {
  render() {
    console.log(instructions);
    if (isIphoneX()) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <Provider store={store}>
            <NavStack />
          </Provider>
        </SafeAreaView>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Provider store={store}>
          <NavStack />
        </Provider>
      </View>
    );
  }
}

export default App;
