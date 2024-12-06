import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import React, {useEffect, useRef} from 'react';
import {
  Platform,
  PushNotificationIOS,
  SafeAreaView,
  StyleSheet,
  Text,
} from 'react-native';
import BottomTab from './src/navigations/BottomTab';
import {useAtom, useSetAtom} from 'jotai';
import {currentScreenAtom} from './src/store/common/atom';
import {CustomStatusBar} from './src/components/common/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {OneSignal} from 'react-native-onesignal';
import {config} from './constants/index';
import {userAtom} from './src/store/user/atom';
import RootNav from './src/navigations/RootNav';
import messaging from '@react-native-firebase/messaging';
// import { Platform, Alert } from 'react-native';
// import PushNotification from 'react-native-push-notification';

function App(): React.JSX.Element {
  const [user, setUser] = useAtom(userAtom);
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  const setCurrentScreen = useSetAtom(currentScreenAtom);

  // // OneSignal Initialization
  // OneSignal?.initialize(config.ONESIGNAL_ID);

  // // requestPermission will show the native iOS or Android notification permission prompt.
  // // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  // OneSignal?.Notifications.requestPermission(true);

  // // Method for listening for notification clicks
  // OneSignal?.Notifications.addEventListener('click', event => {
  //   console.log('OneSignal: notification clicked:', event.result);
  // });

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('enabled', enabled);
      console.log('Authorization status:', authStatus);

      const fcmToken = await messaging().getToken();
      console.log('FCM Token:', fcmToken);

      setUser(prev => ({...prev, fcmToken}));

      // 포그라운드 메시지 리스너
      messaging().onMessage(async remoteMessage => {
        console.log('포그라운드 메시지 수신:', remoteMessage);

        // iOS에서는 알림 표시를 위해 커스텀 처리가 필요
        if (Platform.OS === 'ios') {
        } else {
          // Android는 자동 처리 (일부 라이브러리 필요)
        }
      });

      // 백그라운드 메시지 처리 (트리거됨)
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('백그라운드 메시지 수신:', remoteMessage);
      });
    }
  };

  useEffect(() => {
    // OneSignal.User.getOnesignalId().then(res => {
    //   setUser(prev => ({...prev, onesignal_id: res}));
    // });

    requestUserPermission();
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
