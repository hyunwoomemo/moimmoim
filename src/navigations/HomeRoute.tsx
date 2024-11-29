import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import Home from '../screens/home/Home';
import MeetingDetail from '../screens/home/MeetingDetail';
import MeetingAdd from '../screens/home/MeetingAdd';

const Stack = createNativeStackNavigator();

const HomeRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: 'white'},
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MeetingDetail" component={MeetingDetail} />
      <Stack.Screen name="MeetingAdd" component={MeetingAdd} />
    </Stack.Navigator>
  );
};

export default HomeRoute;
