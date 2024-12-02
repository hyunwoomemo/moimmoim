import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import useSocket from '../../hooks/useSocket';
import {useAtomValue} from 'jotai';
import {userAtom, userDataAtom} from '../../store/user/atom';
import {moimApi} from '../../lib/api';
import useBottomSheet from '../../hooks/useBottomSheet';

const MeetingAdd = ({navigation}) => {
  const [values, setValues] = useState({});
  const user = useAtomValue(userAtom);
  const {generateMeeting} = useSocket();
  const [category, setCategory] = useState({});

  const onChangeText = (type, text) => {
    setValues(prev => ({...prev, [type]: text}));
  };

  console.log('user', user);

  const onPress = () => {
    generateMeeting({
      value: {
        ...values,
        category1: values.category1.id,
        category2: values.category2.id,
        onesignal_id: user.onesignal_id,
      },
      users_id: user.data.id,
    });
  };

  const openAction = () => {
    if (category && Object.keys(category).length === 0) {
      moimApi.getCategory().then(res => {
        setCategory(res);
      });
    }
  };

  const {BottomSheet, open, close} = useBottomSheet({openAction});

  useEffect(() => {
    if (values.category1 && values.category2) {
      close();
    }
  }, [values]);

  return (
    <View style={{flex: 1, padding: 10, gap: 10}}>
      <TextInput
        placeholder="모임명을 입력해주세요."
        value={values.name}
        onChangeText={text => onChangeText('name', text)}
      />
      {values.category1 ? (
        <Pressable
          onPress={() => {
            onChangeText('category1', null);
            onChangeText('category2', null);
            open();
          }}
          style={{flexDirection: 'row', gap: 2, alignItems: 'center'}}>
          <Text>{values.category1?.name}</Text>
          {values.category2 && (
            <>
              <Text>/</Text>
              <Text>{values.category2.name}</Text>
            </>
          )}
        </Pressable>
      ) : (
        <Pressable onPress={open}>
          <Text>주제</Text>
        </Pressable>
      )}
      <TextInput
        placeholder="지역을 입력해주세요."
        value={values.region_code}
        onChangeText={text => onChangeText('region_code', text)}
      />
      <TextInput
        placeholder="최대 인원을 입력해주세요."
        keyboardType="number-pad"
        value={values.maxMembers}
        onChangeText={text => onChangeText('maxMembers', text)}
      />
      <TextInput
        placeholder="상세내용"
        style={{
          textAlignVertical: 'top',
          paddingVertical: 20,
        }}
        multiline={true}
        numberOfLines={10}
        textAlignVertical="top"
        minHeight={200}
        value={values.description}
        onChangeText={text => onChangeText('description', text)}
      />
      <View style={{flexDirection: 'row'}}>
        <Button
          title="일반 모임"
          color={values.type === 3 ? 'tomato' : 'gray'}
          onPress={() => onChangeText('type', 3)}
        />
        <Button
          title="비밀 모임"
          color={values.type === 4 ? 'tomato' : 'gray'}
          onPress={() => onChangeText('type', 4)}
        />
      </View>
      <Button title="전송" onPress={onPress} />
      <BottomSheet>
        <View>
          {category && Object.keys(category).length < 1 ? (
            <ActivityIndicator />
          ) : (
            <>
              {!values.category1 && (
                <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
                  {category.data.category1.map(v => (
                    <Pressable
                      key={v.id}
                      onPress={() => onChangeText('category1', v)}
                      style={{
                        padding: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgb(239,251,255)',
                      }}>
                      <Text>{v.name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
              {values.category1 && (
                <View style={{flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
                  {category.data.category2
                    .filter(v => v.parent_id === values.category1.id)
                    .map(v => (
                      <Pressable
                        key={v.id}
                        onPress={() => onChangeText('category2', v)}
                        style={{
                          padding: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgb(239,251,255)',
                        }}>
                        <Text>{v.name}</Text>
                      </Pressable>
                    ))}
                </View>
              )}
            </>
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

export default MeetingAdd;
