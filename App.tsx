import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import React, {useEffect, useRef} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import BottomTab from './src/navigations/BottomTab';
import {useAtom, useSetAtom} from 'jotai';
import {currentScreenAtom} from './src/store/common/atom';
import {CustomStatusBar} from './src/components/common/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OneSignal} from 'react-native-onesignal';
import {config} from './constants/index';
import {userAtom} from './src/store/user/atom';
import RootNav from './src/navigations/RootNav';

function App(): React.JSX.Element {
  const [user, setUser] = useAtom(userAtom);
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  const setCurrentScreen = useSetAtom(currentScreenAtom);

  // OneSignal Initialization
  OneSignal?.initialize(config.ONESIGNAL_ID);

  // requestPermission will show the native iOS or Android notification permission prompt.
  // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  OneSignal?.Notifications.requestPermission(true);

  // Method for listening for notification clicks
  OneSignal?.Notifications.addEventListener('click', event => {
    console.log('OneSignal: notification clicked:', event.result);
  });

  console.log('one one ::', config.ONESIGNAL_ID);
  console.log(
    'one one ::',
    OneSignal.User.getOnesignalId().then(res => console.log('rrr', res)),
  );

  useEffect(() => {
    OneSignal.User.getOnesignalId().then(res => {
      setUser(prev => ({...prev, onesignal_id: res}));
    });
  }, []);

  return (
    <SafeAreaProvider>
      <CustomStatusBar backgroundColor={'#fff'} barStyle={'dark-content'} />
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          routeNameRef.current = navigationRef.current.getCurrentRoute().name;
          setCurrentScreen(navigationRef.current.getCurrentRoute().name);
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          setCurrentScreen(currentRouteName);
          const trackScreenView = () => {
            // Your implementation of analytics goes here!
          };

          if (previousRouteName !== currentRouteName) {
            // Replace the line below to add the tracker from a mobile analytics SDK
            // await trackScreenView(currentRouteName);
          }

          // Save the current route name for later comparison
          routeNameRef.current = currentRouteName;
        }}>
        <RootNav />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
