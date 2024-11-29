import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import React from 'react';
import Home from '../screens/home/Home';
import List from '../screens/List';
import MyMeeting from '../screens/MyMeeting';
import Profile from '../screens/Profile';
import useSocket from '../hooks/useSocket';
import HomeRoute from './HomeRoute';

const Bottom = createBottomTabNavigator();

const BottomTab = props => {
  const {} = useSocket();

  return (
    <Bottom.Navigator
      screenOptions={{headerShown: false}}
      sceneContainerStyle={{backgroundColor: '#fff'}}>
      <Bottom.Screen name="HomeRoute" component={HomeRoute} />
      <Bottom.Screen name="List" component={List} />
      <Bottom.Screen name="MyMeeting" component={MyMeeting} />
      <Bottom.Screen name="Profile" component={Profile} />
    </Bottom.Navigator>
  );
};

export default BottomTab;
