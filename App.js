import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  YellowBox,
} from 'react-native';
import {
  Constants,
  AppLoading,
  Asset,
  Font,
  Icon,
} from 'expo';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

import AppNavigator from './navigation/AppNavigator';
import reducer from './reducer';

const { manifest } = Constants;

YellowBox.ignoreWarnings([
  // Ignore proptype warning from 3rd party library
  'Warning: Failed prop type: Invalid prop `ImageComponent` of type `object` supplied to `Avatar`',
]);

// Get the host computer's IP address if running locally
const apiUrl = (typeof manifest.packagerOpts === 'object') && manifest.packagerOpts.dev
  ? 'http://'.concat(manifest.debuggerHost.split(':').shift().concat(':5000'))
  : 'api-name-here';
console.log('API URL', apiUrl);

const client = axios.create({
  baseURL: apiUrl,
  responseType: 'json',
});

const store = createStore(reducer, applyMiddleware(axiosMiddleware(client)));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default class App extends React.Component {

  state = {
    isLoadingComplete: false,
  };

  loadResourcesAsync = async () => {
    /* eslint-disable global-require */
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
    /* eslint-enable global-require */
  };

  handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    let content = null;
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;
    if (!isLoadingComplete && !skipLoadingScreen) {
      content = (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    } else {
      content = (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
    return (
      <Provider store={store}>
        {content}
      </Provider>
    );
  }
}

App.propTypes = {
  skipLoadingScreen: PropTypes.bool,
};
