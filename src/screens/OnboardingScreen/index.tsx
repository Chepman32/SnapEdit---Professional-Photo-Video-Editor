/**
 * Onboarding Screen - Placeholder
 * Will be enhanced with 3-screen flow and animations in Phase 7
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors, typography, spacing} from '@theme';

export const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SnapEdit</Text>
      <Text style={styles.subtitle}>Professional Photo & Video Editing</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Main' as never)}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.text.tertiary,
    marginBottom: spacing.xxl,
  },
  button: {
    backgroundColor: colors.accent.electricBlue,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
  },
  buttonText: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.semantic.neutralWhite,
  },
});
