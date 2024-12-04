import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom} from 'jotai';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {userAtom} from '../store/user/atom';
import {OneSignal} from 'react-native-onesignal';

const Profile = () => {
  const [user, setUser] = useAtom(userAtom);

  const handleLogout = async () => {
    setUser(prev => ({...prev, data: {}}));

    OneSignal.logout();
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
  };

  return (
    <View>
      <Text>Profile</Text>
      <Button title="로그아웃" onPress={handleLogout} />
    </View>
  );
};

export default Profile;
