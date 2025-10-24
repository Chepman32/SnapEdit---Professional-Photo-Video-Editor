/**
 * Tab Navigator
 * Bottom tab navigation with custom styling
 */

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {MainTabParamList} from './types';
import {colors} from '@theme';

// Placeholder screens - will be created in next phases
import {HomeScreen} from '@screens/HomeScreen';
import {GalleryScreen} from '@screens/GalleryScreen';
import {ToolsScreen} from '@screens/ToolsScreen';
import {ProfileScreen} from '@screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.primary.carbonGray,
          borderTopColor: colors.border.default,
          borderTopWidth: 0.5,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.accent.electricBlue,
        tabBarInactiveTintColor: colors.primary.steelGray,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Gallery':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Tools':
              iconName = focused ? 'construct' : 'construct-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Icon name={iconName} size={26} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Gallery" component={GalleryScreen} />
      <Tab.Screen name="Tools" component={ToolsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
