/**
 * Button Component
 * Reusable button with animations and variants
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, {duration: 100});
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {damping: 12, stiffness: 150});
  };

  React.useEffect(() => {
    opacity.value = disabled ? 0.4 : 1;
  }, [disabled, opacity]);

  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    textStyle,
  ];

  return (
    <AnimatedTouchable
      style={[buttonStyle, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}>
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary' || variant === 'premium'
              ? colors.semantic.neutralWhite
              : colors.accent.electricBlue
          }
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
    ...shadows.medium,
  },

  // Variants
  primary: {
    backgroundColor: colors.accent.electricBlue,
  },
  secondary: {
    backgroundColor: colors.primary.carbonGray,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.accent.electricBlue,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  premium: {
    backgroundColor: colors.accent.vividPurple,
  },

  // Sizes
  size_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  size_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  size_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 64,
  },

  // Text styles
  text: {
    ...typography.bodyLarge,
    fontWeight: '600',
  },
  text_primary: {
    color: colors.semantic.neutralWhite,
  },
  text_secondary: {
    color: colors.text.primary,
  },
  text_outline: {
    color: colors.accent.electricBlue,
  },
  text_ghost: {
    color: colors.accent.electricBlue,
  },
  text_premium: {
    color: colors.semantic.neutralWhite,
  },

  // Size text
  text_small: {
    ...typography.body,
  },
  text_medium: {
    ...typography.bodyLarge,
  },
  text_large: {
    ...typography.h3,
  },

  disabled: {
    opacity: 0.4,
  },
});
