import {atom} from 'jotai';
import {selectAtom} from 'jotai/utils';

export const userAtom = atom({
  data: {},
  region: '',
});

export const userDataAtom = selectAtom(userAtom, user => user.data);
