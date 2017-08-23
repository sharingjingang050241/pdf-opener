/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
} from 'react-native';
import App from './file_open/app';

export default class demo extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('demo', () => demo);
