import React, {useEffect} from 'react';
import {View} from 'react-native';
import Text from '../components/common/Text';
import {authApi} from '../lib/api';
import {useSetAtom} from 'jotai';
import {userAtom} from '../store/user/atom';

const Splash = ({navigation}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'tomato',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text bold size={24} color={'#fff'}>
        Splash
      </Text>
    </View>
  );
};

export default Splash;
