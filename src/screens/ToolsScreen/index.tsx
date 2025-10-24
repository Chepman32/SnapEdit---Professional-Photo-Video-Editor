/**
 * Tools Screen - Placeholder
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors, typography, spacing} from '@theme';

export const ToolsScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Tools</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Tools and utilities will appear here</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  placeholder: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
