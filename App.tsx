import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';

import React, {useRef} from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import BottomTab from './src/navigations/BottomTab';
import {useSetAtom} from 'jotai';
import {currentScreenAtom} from './src/store/common/atom';
import {CustomStatusBar} from './src/components/common/CustomStatusBar';
import {SafeAreaProvider} from 'react-native-safe-area-context';

function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef();

  const setCurrentScreen = useSetAtom(currentScreenAtom);

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
        <BottomTab />
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
