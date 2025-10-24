/**
 * Home Screen - Placeholder
 * Will be enhanced with quick actions and recent edits in Phase 8
 */

import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, typography, spacing} from '@theme';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>SnapEdit</Text>
      </View>
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <Text style={styles.placeholder}>Quick action cards will appear here</Text>

        <Text style={styles.sectionTitle}>Recent Edits</Text>
        <Text style={styles.placeholder}>Recent edits will appear here</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
  },
  header: {
    height: 100,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
  },
  title: {
    ...typography.h3,
    color: colors.text.primary,
  },
  content: {
    flex: 1,
    padding: spacing.screenPadding,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  placeholder: {
    ...typography.body,
    color: colors.text.tertiary,
    marginBottom: spacing.lg,
  },
});
