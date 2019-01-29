import React from 'react';
import { Platform } from 'react-native';
import { Icon } from 'expo';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
} from 'react-navigation';

import TabBarIcon from './TabBarIcon';
import Home from '../screens/Home/Home';
import Map from '../screens/Map/Map';
import TreeForm from '../screens/Map/TreeForm';
import TreeDetail from '../screens/Map/TreeDetail';
import AllPosts from '../screens/Posts/AllPosts';
import MyPosts from '../screens/Posts/MyPosts';
import PostDetail from '../screens/Posts/PostDetail';
import SettingsScreen from '../screens/SettingsScreen';
import WebScreen from '../screens/WebScreen';
import SearchSpeciesModal from '../screens/SearchSpeciesModal';

import Colors from '../constants/Colors';

const MapStack = createStackNavigator(
  {
    Map,
    TreeForm,
    TreeDetail,
    WebScreen,
    SearchSpeciesModal,
  },
  {
    cardStyle: {
      backgroundColor: 'rgba(0, 0, 0, .5)',
      opacity: 1,
    },
    initialRouteName: 'Map',
  },
);

MapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-map' : 'md-map'}
    />
  ),
};

const HomeStack = createStackNavigator({
  Home,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const AllPostsStack = createStackNavigator({
  AllPosts,
  AllPostDetail: PostDetail,
  SearchSpeciesModal,
});

const MyPostsStack = createStackNavigator({
  MyPosts,
  MyPostDetail: PostDetail,
  SearchSpeciesModal,
});

const PostStack = createMaterialTopTabNavigator({
  'all posts': AllPostsStack,
  'my posts': MyPostsStack,
})

PostStack.navigationOptions = {
  tabBarLabel: 'Posts',
  tabBarIcon: ({ focused }) => (
    <Icon.MaterialIcons
      name="question-answer"
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  ),
};


const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  MapStack,
  HomeStack,
  PostStack,
  SettingsStack,
});
