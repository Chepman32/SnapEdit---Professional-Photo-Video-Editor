/**
 * Splash Screen - Placeholder
 * Will be enhanced with particle animations in Phase 6
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, typography} from '@theme';

export const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Navigate to onboarding or main after delay
    const timer = setTimeout(() => {
      navigation.navigate('Main' as never);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>SnapEdit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    ...typography.hero,
    color: colors.accent.electricBlue,
  },
});
