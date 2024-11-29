import {useAtomValue} from 'jotai';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {userDataAtom} from '../../store/user/atom';
import {areas} from '../../../dummy';
import Text from './Text';

const Header = ({home, title}) => {
  const user = useAtomValue(userDataAtom);

  if (home) {
    return (
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        <TouchableOpacity>
          <Text bold size={16}>
            {areas.find(v => v.code === user.region_code)?.name}
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', gap: 10}}>
          <TouchableOpacity>
            <Text>icon1</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>icon2</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>icon3</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text>Header</Text>
    </View>
  );
};

export default Header;
