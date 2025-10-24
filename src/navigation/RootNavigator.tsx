/**
 * Root Navigator
 * Main stack navigator for the app
 */

import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import {RootStackParamList} from './types';
import {TabNavigator} from './TabNavigator';

// Import screens (placeholders for now)
import {SplashScreen} from '@screens/SplashScreen';
import {OnboardingScreen} from '@screens/OnboardingScreen';
import {EditorScreen} from '@screens/EditorScreen';
import {SettingsScreen} from '@screens/SettingsScreen';
import {PaywallScreen} from '@screens/PaywallScreen';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Main"
        component={TabNavigator}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="Editor"
        component={EditorScreen}
        options={{
          presentation: 'modal',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'modal',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <Stack.Screen
        name="Paywall"
        component={PaywallScreen}
        options={{
          presentation: 'modal',
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
    </Stack.Navigator>
  );
};
