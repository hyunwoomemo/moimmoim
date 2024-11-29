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
  const [user, setUser] = useAtom(userAtom);

  if (user.data && Object.keys(user.data).length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 10,
          // flexWrap: 'wrap',
        }}>
        {users.map(v => (
          <TouchableOpacity
            key={v.id}
            onPress={() => setUser(prev => ({...prev, data: v}))}
            style={{
              // flex: 1,
              alignItems: 'center',
              padding: 50,
              backgroundColor: 'lightgray',
              borderRadius: 20,
            }}>
            <Text>{v.nickname}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }

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
