import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom, useAtomValue} from 'jotai';
import React from 'react';
import {View, Text, Button} from 'react-native';
import {userAtom} from '../store/user/atom';

const Profile = () => {
  const [user, setUser] = useAtom(userAtom);

  const handleLogout = async () => {
    setUser(prev => ({...prev, data: {}}));

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
