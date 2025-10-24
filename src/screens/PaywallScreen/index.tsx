/**
 * Paywall Screen - Placeholder
 * Will be enhanced in Phase 21
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing} from '@theme';

export const PaywallScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View style={{width: 28}} />
        <Text style={styles.title}>Unlock Premium</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={colors.accent.electricBlue} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Icon name="diamond" size={80} color={colors.accent.vividPurple} />
        <Text style={styles.heading}>SnapEdit Premium</Text>
        <Text style={styles.description}>
          Unlock all filters, tools, and features
        </Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
  },
  title: {
    ...typography.body,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  heading: {
    ...typography.h1,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.text.tertiary,
    marginBottom: spacing.xxl,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.accent.vividPurple,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    ...typography.bodyLarge,
    fontWeight: '600',
    color: colors.semantic.neutralWhite,
  },
});
