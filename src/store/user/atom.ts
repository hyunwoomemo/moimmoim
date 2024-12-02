import {atom} from 'jotai';
import {selectAtom} from 'jotai/utils';

export const userAtom = atom({
  data: {},
  onesignal_id: '',
});

export const userDataAtom = selectAtom(userAtom, user => user.data);

export const isLoggedInAtom = selectAtom(
  userAtom,
  user => user.data && Object.keys(user.data).length > 0,
);
