import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAtomValue, useSetAtom} from 'jotai';
import React, {useEffect, useState} from 'react';
import {isLoggedInAtom, userAtom} from '../store/user/atom';
import BottomTab from './BottomTab';
import OutNav from './OutNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authApi} from '../lib/api';
import Splash from '../screens/Splash';

const Stack = createNativeStackNavigator();

const RootNav = () => {
  const isLoggedIn = useAtomValue(isLoggedInAtom);
  const [loading, setLoading] = useState(true);

  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    authApi.getUserInfo().then(res => {
      console.log('getUserInfo res', res);
      if (res.success) {
        setUser(prev => ({...prev, data: {...res.data, region_code: 'A02'}}));
      }
    });
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <BottomTab />
      ) : (
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="OutNav" component={OutNav} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default RootNav;
