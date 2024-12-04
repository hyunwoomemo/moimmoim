import React, {useState} from 'react';
import {Alert, Button, TextInput, View} from 'react-native';
import Text from '../../components/common/Text';
import {authApi} from '../../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAtom} from 'jotai';
import {userAtom} from '../../store/user/atom';
import {OneSignal} from 'react-native-onesignal';

const Login = () => {
  const [values, setValues] = useState({});
  const [user, setUser] = useAtom(userAtom);

  const handleChangeText = (type, value) => {
    setValues(prev => ({...prev, [type]: value}));
  };

  const handleLogin = async () => {
    const {email, password} = values;
    const res = await authApi.login({email, password});

    console.log('res', res);

    if (!res.success) {
      return;
    }

    OneSignal.login(email);

    const {accessToken, refreshToken} = res.data;

    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);

    const info = await authApi.getUserInfo();

    console.log('info', info);

    if (info.success) {
      setUser(prev => ({...prev, data: {...info.data, region_code: 'A03'}}));
    } else {
      Alert.alert('유저 정보 호출에 실패했습니다.');
    }
  };

  return (
    <View
      style={{
        // backgroundColor: 'lightgray',
        flex: 1,
        justifyContent: 'center',
        padding: 20,
      }}>
      <Text bold size={20}>
        Login
      </Text>
      <View style={{padding: 0}}>
        <TextInput
          placeholder="email"
          style={{padding: 20, fontSize: 24}}
          onChangeText={text => handleChangeText('email', text)}
        />
        <TextInput
          secureTextEntry
          placeholder="pw"
          style={{padding: 20, fontSize: 24}}
          onChangeText={text => handleChangeText('password', text)}
        />
        <Button title="로그인" onPress={handleLogin} />
      </View>
    </View>
  );
};

export default Login;
