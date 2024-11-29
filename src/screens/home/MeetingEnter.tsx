import {useAtomValue} from 'jotai';
import React from 'react';
import {View, Text} from 'react-native';
import {moimEnterStatusAtom} from '../../store/meeting/atom';

const MeetingEnter = () => {
  const moimEnterStatus = useAtomValue(moimEnterStatusAtom);

  return (
    <View>
      <Text>MeetingEnter</Text>
    </View>
  );
};

export default MeetingEnter;
