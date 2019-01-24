import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';

import AppStack from './MainTabNavigator';
import Login from '../components/Login';
import LoginLoading from '../components/LoginLoading';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AuthStack = createStackNavigator({ Login });

export default createSwitchNavigator(
  {
    App: AppStack,
    AuthLoading: LoginLoading,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);
