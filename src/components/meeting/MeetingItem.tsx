import {useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import 'moment/locale/ko';
import Text from '../common/Text';

const MeetingItem = ({data}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('MeetingDetail', {id: data.id, type: data.type})
      }
      style={{padding: 10, flexDirection: 'row', gap: 10}}>
      <View
        style={{
          width: 80,
          height: '100%',
          backgroundColor: 'lightgray',
          borderRadius: 10,
        }}
      />
      <View
        style={{
          flex: 1,
          padding: 5,
          gap: 5,
          justifyContent: 'space-between',
        }}>
        <Text>{data.name}</Text>
        <View style={{flexDirection: 'row', gap: 5, alignItems: 'center'}}>
          <Text size={12} color={''}>
            {data.category1_name}
          </Text>
          <Text size={10} color={'gray'}>
            /
          </Text>
          <Text size={12}>{data.category2_name}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            {data.last_active_time && (
              <Text size={12} color={'#217574'}>
                {moment(data.last_active_time).fromNow()}
              </Text>
            )}
            <Text>{data.type === 3 ? '일반 모임' : '비밀 모임'}</Text>
          </View>
          <Text>{data.userCount}명</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MeetingItem;
