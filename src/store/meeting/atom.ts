import {atom} from 'jotai';
import {selectAtom} from 'jotai/utils';

export const meetingAtom = atom({
  list: [],
  messages: [],
  region: 'A02',
  data: {},
  room: {},
  load: false,
  meesageLength: 0,
  activeUsers: [],
  typingUsers: [],
});

export const moimEnterStatusAtom = atom();

export const meetingListAtom = selectAtom(meetingAtom, meeting => meeting.list);

export const meetingMessagesAtom = selectAtom(
  meetingAtom,
  meeting => meeting.messages,
);
