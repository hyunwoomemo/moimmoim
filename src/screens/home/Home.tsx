import React, {useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {meetingListAtom} from '../../store/meeting/atom';
import {useAtom, useAtomValue} from 'jotai';
import {userAtom} from '../../store/user/atom';
import {users} from '../../../dummy';
import Screen from '../../components/common/Screen';
import MeetingList from '../../components/meeting/MeetingList';
import {useNavigationState} from '@react-navigation/native';

const Home = ({navigation}) => {
  return (
    <Screen home>
      <MeetingList />
      <TouchableOpacity
        onPress={() => navigation.navigate('MeetingAdd')}
        style={{
          position: 'absolute',
          bottom: 25,
          right: 25,
          width: 70,
          height: 70,
          backgroundColor: 'lightgray',
          borderRadius: 35,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>추가</Text>
      </TouchableOpacity>
    </Screen>
  );
};

export default Home;
