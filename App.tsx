import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {useAtom, useSetAtom} from 'jotai';
import {currentScreenAtom} from './src/store/common/atom';
import {CustomStatusBar} from './src/components/common/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {userAtom} from './src/store/user/atom';
import RootNav from './src/navigations/RootNav';
import messaging from '@react-native-firebase/messaging';
// import { Platform, Alert } from 'react-native';
// import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import {StyleSheet} from 'react-native-unistyles';
import {appThemes, breakpoints} from './unistyles';

function App(): React.JSX.Element {
  const setUser = useSetAtom(userAtom);
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  useEffect(() => {
    DeviceInfo.getUniqueId().then(device_id => {
      console.log('device_id', device_id);
    }); // 디바이스 고유 ID
  }, []);

  const setCurrentScreen = useSetAtom(currentScreenAtom);

  const requestUserPermission = useCallback(async () => {
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
  }, [setUser]);

  useEffect(() => {
    requestUserPermission();
  }, [requestUserPermission]);

  useEffect(() => {
    StyleSheet.configure({
      settings: {
        initialTheme: 'light',
      },
      breakpoints: breakpoints,
      themes: appThemes,
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

export default App;
