import {useAtomValue} from 'jotai';
import React, {useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity} from 'react-native';
import {meetingListAtom, moimEnterStatusAtom} from '../../store/meeting/atom';
import {useNavigation} from '@react-navigation/native';
import MeetingItem from './MeetingItem';
import {FlashList} from '@shopify/flash-list';

const MeetingList = () => {
  const navigation = useNavigation();
  const meetingList = useAtomValue(meetingListAtom);
  const moimEnterStatus = useAtomValue(moimEnterStatusAtom);
  const renderItem = useCallback(({item, index}) => {
    return (
      // <TouchableOpacity
      //   onPress={() => navigation.navigate('MeetingDetail', {id: item.id})}
      //   style={{padding: 10}}>
      //   <Text>{item.name}</Text>
      // </TouchableOpacity>
      <MeetingItem data={item} moimEnterStatus={moimEnterStatus} />
    );
  }, []);

  return (
    <FlashList
      // contentContainerStyle={{flex: 1}}
      estimatedItemSize={65}
      data={meetingList}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.id}-${index}`}
    />
  );
};

export default MeetingList;
