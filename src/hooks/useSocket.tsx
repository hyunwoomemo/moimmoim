import {useAtom, useAtomValue} from 'jotai';
import {useEffect, useState} from 'react';
import io from 'socket.io-client';
import {meetingAtom, moimEnterStatusAtom} from '../store/meeting/atom';
import {userDataAtom} from '../store/user/atom';
import {useNavigation} from '@react-navigation/native';
import {config} from '../../constants';
import moment from 'moment';
import {nextParseMessages, parseMessages} from '../lib/parseMessages';

export let socket = null;

const useSocket = () => {
  const [meeting, setMeeting] = useAtom(meetingAtom);
  const user = useAtomValue(userDataAtom);
  const navigation = useNavigation();
  const [moimEnterStatus, setMoimEnterStatus] = useAtom(moimEnterStatusAtom);

  // useEffect(() => {
  //   setMeeting(prev => ({...prev, load: true}));
  // }, []);

  if (user && Object.keys(user).length > 0 && !socket) {
    socket = io(config.SOCKET_URL, {
      // socket = io('ws://moimmoim.duckdns.org', {
      reconnectionDelayMax: 10000,
      // forceNew: true, // Ensures a fresh connection each time
      transports: ['websocket'], // Enforces the use of WebSocket transport
    });
  }

  useEffect(() => {
    if (!socket || !user) {
      return;
    }

    socket.removeAllListeners();
    //

    // Enable debugging
    socket.on('connect', () => {
      if (user && Object.keys(user).length > 0) {
        socket.emit('userData', user);
      }

      if (meeting.room && Object.keys(meeting.room).length > 0) {
        enterMeeting({
          meetings_id: meeting.room.meetings_id,
          region_code: meeting.room.region_code,
        });
        setMeeting(prev => ({...prev, room: false}));
      }
    });

    socket.on('myList', data => {});

    socket.on('connect_error', error => {});

    socket.on('disconnect', data => {});

    socket.on('message', id => {
      socket.emit('join', {
        region_code: user.region_code,
        user: {name: user.name},
      });
    });

    // socket.on('generateEnter', id => {
    //   navigation.navigate('MeetingDetail', {id});
    // });

    socket.on('enterRes', data => {
      setMoimEnterStatus(data);
    });

    socket.on('list', data => {
      setMeeting(prev => ({...prev, list: data}));
    });

    socket.on('messages', data => {
      // const parseData = data.list;

      const parseData = nextParseMessages(data.list);

      console.log('parseData', parseData);

      setMeeting(prev => ({
        ...prev,
        messages: {...data, list: parseData},
        meesageLength: data.total,
      }));
    });

    socket.on('usersInRoom', data => console.log('usersInRoom', data));

    socket.off('receiveMessage').on('receiveMessage', data => {
      socket.emit('readMessage', {
        id: data.id,
        meetings_id: data.meetings_id,
        users_id: data.users_id,
      });
      setMeeting(prev => ({
        ...prev,
        messages: {list: nextParseMessages([data, ...prev.messages.list])},
      }));
    });

    socket.on('meetingActive', data => {
      console.log('meetingActive', data);
      setMeeting(prev => ({...prev, activeUsers: data}));
    });

    socket.on('meetingData', data => {
      setMeeting(prev => ({...prev, data}));
    });

    socket.on('userTyping', data => {
      console.log('usertyping', data);
      setMeeting(prev => ({...prev, typingUsers: data}));
    });

    socket.on('disconnect', e => {});

    return () => {
      // socket
      // socket.disconnect();
    };
  }, [user, socket]);

  const enterMeeting = ({region_code, meetings_id, type}) => {
    socket.emit('enterMeeting', {
      region_code,
      meetings_id,
      type,
      users_id: user.id,
    });

    setMeeting(prev => ({...prev, room: {region_code, meetings_id}}));
  };

  const sendMessage = ({text, meetings_id, region_code}) => {
    if (!text) {
      return;
    }

    socket.emit('sendMessage', {
      contents: text,
      meetings_id,
      region_code,
      users_id: user.id,
    });
  };

  const generateMeeting = ({value, users_id}) => {
    socket.emit('generateMeeting', {
      ...value,
      users_id,
    });

    navigation.navigate('Home');
  };

  const joinMeeting = ({region_code, users_id, meetings_id, type}) => {
    socket.emit('joinMeeting', {
      region_code,
      users_id,
      meetings_id,
      type,
    });
  };

  return {socket, enterMeeting, sendMessage, generateMeeting, joinMeeting};
};

export default useSocket;