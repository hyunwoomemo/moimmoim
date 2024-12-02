import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, FlatList, TextInput, Button} from 'react-native';
import useSocket from '../../hooks/useSocket';
import {useAtom, useAtomValue, useSetAtom} from 'jotai';
import {meetingAtom, moimEnterStatusAtom} from '../../store/meeting/atom';
import moment from 'moment';
import {users} from '../../../dummy';
import {userAtom, userDataAtom} from '../../store/user/atom';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {currentScreenAtom} from '../../store/common/atom';
import Text from '../../components/common/Text';
import {FlashList} from '@shopify/flash-list';
import {moimApi} from '../../lib/api';

const MeetingDetail = ({route}) => {
  const [meeting, setMeeting] = useAtom(meetingAtom);
  const setCurrentScreen = useSetAtom(currentScreenAtom);

  console.log('meeting.messages', meeting.messages);

  const moimEnterStatus = useAtomValue(moimEnterStatusAtom);

  useEffect(() => {
    setCurrentScreen(route);
  }, []);
  const [scrollLoading, setScrollLoading] = useState(true);

  const [text, setText] = useState('');
  const user = useAtomValue(userAtom);

  const scrollViewRef = useRef();
  const newMessageRef = useRef();

  const {enterMeeting, sendMessage, socket, joinMeeting} = useSocket();
  useEffect(() => {
    // socket.emit('enterMeeting', {
    //   region_code: 'A02',
    //   meetings_id: route.params.id,
    // });

    enterMeeting({
      region_code: user.data.region_code,
      meetings_id: route.params.id,
      type: route.params.type,
    });
    return () => {
      socket.emit('leaveMeeting', {
        region_code: user.data.region_code,
        meetings_id: route.params.id,
      });
      // leaveMeeting({
      //   region_code: user.region_code,
      //   meetings_id: route.params.id,
      // });
    };
  }, []);

  console.log('message');

  const unReadCheck = item => {
    // 나를 제외한 읽어야할 사람들
    const readUsers = item.users
      .split(',')
      .filter(v => v != item.users_id)
      .map(v => Number(v));
    console.log('readUsers', readUsers);

    // 읽어야할 사람들의 활동시간
    const activeUsers = meeting?.activeUsers?.filter(v =>
      readUsers.includes(v.users_id),
    );

    console.log('activeUsers', activeUsers);

    const count = readUsers.reduce((result, cur) => {
      if (
        moment(
          activeUsers.find(v => v.users_id == cur)?.last_active_time,
        ).isBefore(moment(item.created_at))
      ) {
        result = result + 1;
      }

      return result;
    }, 0);

    console.log('cccc', count);
    return count;
  };

  const renderItem = useCallback(
    ({item, index}) => {
      console.log('zxczxczxc', item);

      if (!item) {
        return;
      }

      if (item.admin > 0) {
        return (
          <View
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              backgroundColor: 'tomato',
            }}>
            <Text bold color={'#fff'}>
              {item.contents}
            </Text>
          </View>
        );
      } else {
        return (
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent:
                  item.users_id === user.data.id ? 'flex-end' : 'flex-start',
              }}>
              <View style={{padding: 5, gap: 5}}>
                {item.users_id !== user.data.id && item.first && (
                  <View>
                    <Text size={16}>{item.users_id}</Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection:
                      item.users_id === user.data.id ? 'row-reverse' : 'row',
                    gap: 10,
                    alignItems: 'center',
                    padding: 3,
                    borderRadius: 5,
                  }}>
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: '#fff',
                      // marginHorizontal: 5,
                    }}>
                    <Text size={16}>{item.contents}</Text>
                  </View>
                  {item.end ? (
                    <View style={{marginTop: 'auto'}}>
                      {unReadCheck(item) > 0 && (
                        <View
                          style={{
                            marginLeft:
                              item.users_id === user.data.id ? 'auto' : '',
                          }}>
                          <Text size={12} color={'gray'}>
                            {unReadCheck(item)}
                          </Text>
                        </View>
                      )}

                      <Text size={12} color={'gray'}>
                        {moment(item.created_at).format('HH:mm')}
                      </Text>
                    </View>
                  ) : (
                    <View style={{marginTop: 'auto'}}>
                      {unReadCheck(item) > 0 && (
                        <View
                          style={{
                            marginLeft:
                              item.users_id === user.data.id ? 'auto' : '',
                          }}>
                          <Text size={12} color={'gray'}>
                            {unReadCheck(item)}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </>
        );
      }
    },
    [meeting],
  );

  const handleSendMessage = () => {
    console.log('nnn', new Date());

    sendMessage({
      text,
      meetings_id: route.params.id,
      region_code: meeting.data.region_code,
    });

    setText('');
  };

  useEffect(() => {
    // setScrollLoading(true);
    if (!meeting.messages.list) {
      return;
    }

    setTimeout(() => {
      setScrollLoading(false);
    }, 300);
  }, [meeting.messages.list]); // 메시지가 로드된 후 실행

  const onEndReached = useCallback(() => {
    if (meeting && !meeting.messages.list) {
      return;
    }
    if (
      !meeting.messages ||
      meeting?.messages?.list?.length < 19 ||
      meeting?.messages?.list?.length >= meeting?.meesageLength
    ) {
      return;
    }

    moimApi
      .getMoreMessage({
        meetings_id: route.params.id,
        length: meeting?.messages?.list?.length,
      })
      .then(res => {
        setMeeting(prev => ({
          ...prev,
          messages: {list: [...prev.messages.list, ...res.DATA.list]},
        }));
      });
  }, [meeting]);

  const handleJoinMeeting = () => {
    console.log('handleJoinMeetinghandleJoinMeeting', user);
    joinMeeting({
      meetings_id: route.params.id,
      region_code: user.data.region_code,
      users_id: user.data.id,
      type: route.params.type,
      onesignal_id: user.onesignal_id,
    });
  };

  if (moimEnterStatus?.CODE !== 'EM000') {
    return (
      <View>
        <Text>인트로</Text>
        <Button onPress={handleJoinMeeting} title="입장하기" />
      </View>
    );
  }

  const handleChangeText = text => {
    socket?.emit('typing', {
      region_code: user.data.region_code,
      meetings_id: route.params.id,
      users_id: user.data.id,
    });
    setText(text);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'rgb(239,251,255)'}}>
      <Text>{meeting?.data?.name}</Text>
      {meeting?.activeUsers?.map((v, i) => (
        <View key={`${v.users_id}-${i}`}>
          <Text>{v.users_id}</Text>
          <Text>{moment(v.last_active_time).format('hh:mm:ss a')}</Text>
        </View>
      ))}
      <View style={{flex: 1, opacity: scrollLoading ? 0 : 1}}>
        <FlashList
          inverted
          scrollEventThrottle={16}
          estimatedItemSize={50}
          removeClippedSubviews
          // initialScrollIndex={3}
          data={meeting.messages.list}
          onLayout={e => {}}
          onEndReached={onEndReached}
          // onEndReachedThreshold={99}r
          // onScroll={e => console.log('eeee', e.nativeEvent)}
          // initialScrollIndex={
          //   meeting.messages.index > -1 && meeting.messages.index
          // }inverted contentContainerStyle={{ flexDirection: 'column-reverse' }}
          renderItem={renderItem}
          // style={{flexDirection: 'column-reverse'}}
          contentContainerStyle={{
            padding: 10,
            // justifyContent: 'flex-end',
          }}
          // style={{opacity: 0.2}}
          keyExtractor={(item, index) => `${item?.id}-${index}`}
          ref={scrollViewRef}
          // onContentSizeChange={() => {
          //   !scrollLoading &&
          //     scrollViewRef?.current?.scrollToEnd({animated: false});
          //   // setScrollLoading(false);
          // }}
          // getItemLayout={(data, index) => ({
          //   length: 55,
          //   offset: 55 * index,
          //   index,
          // })}
        />
      </View>
      {meeting.typingUsers.filter(v => v.users_id !== user.data.id).length >
        0 && (
        <Text color={'gray'} style={{padding: 10, backgroundColor: '#fff'}}>
          {meeting.typingUsers
            .filter(v => v.users_id !== user.data.id)
            .map(v => v.users_id)
            .join(',')}
          님이 입력 중입니다.
        </Text>
      )}
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 20}}>
        <TextInput
          onChangeText={handleChangeText}
          value={text}
          onSubmitEditing={handleSendMessage}
          style={{flex: 1, borderWidth: 1, padding: 10, borderRadius: 10}}
        />
        <Button title="전송" onPress={handleSendMessage} />
      </View>
    </View>
  );
};

export default MeetingDetail;
