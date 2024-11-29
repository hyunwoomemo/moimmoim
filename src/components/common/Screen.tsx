import {Text, View} from 'react-native';
import Header from './Header';

const Screen = ({children, title, home}) => {
  return (
    <View style={{flex: 1}}>
      <Header home={home} title={title} />
      {children}
    </View>
  );
};

export default Screen;
