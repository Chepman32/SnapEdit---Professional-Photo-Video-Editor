/**
 * Card Component
 * Reusable card container with shadow and styling
 */

import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {colors, borderRadius, shadows, spacing} from '@theme';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outline';
  padding?: keyof typeof spacing;
  style?: ViewStyle;
  onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
}) => {
  return (
    <View
      style={[
        styles.base,
        styles[variant],
        {padding: spacing[padding]},
        style,
      ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.card,
    backgroundColor: colors.primary.carbonGray,
  },
  default: {
    ...shadows.subtle,
  },
  elevated: {
    ...shadows.medium,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border.default,
  },
});
