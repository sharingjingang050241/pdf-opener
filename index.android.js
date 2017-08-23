/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  BackHandler,
  ToastAndroid
} from 'react-native';
import App from './file_open/app';

export default class demo extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
    let lastBackPressed;
    BackHandler.addEventListener('hardwareBackPress', function () {
      // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
      // Typically you would use the navigator here to go to the last state.
      if (lastBackPressed && (lastBackPressed + 2000 >= Date.now())) {
        return false;
      }
      else {
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        lastBackPressed = Date.now();
        return true;
      }
      return false;
    });
  }

  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('demo', () => demo);
