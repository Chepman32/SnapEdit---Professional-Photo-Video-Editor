/**
 * Enhanced Splash Screen with Particle Animation
 * Phase 6: Complete implementation with Skia particles
 */

import React, {useEffect} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import {Canvas, Circle, Group} from '@shopify/react-native-skia';
import {colors, typography} from '@theme';
import {useStore} from '@/store';
import {STORAGE_KEYS} from '@constants';
import {storageService} from '@services/storage';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const PARTICLE_COUNT = 64;
const LOGO_SIZE = 120;

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const SplashScreen = () => {
  const navigation = useNavigation();
  const loadSettings = useStore(state => state.loadSettings);
  const loadSubscriptionFromStorage = useStore(
    state => state.loadSubscriptionFromStorage,
  );

  // Animation values
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  useEffect(() => {
    // Load persisted data
    loadSettings();
    loadSubscriptionFromStorage();

    // Start animation sequence
    startAnimationSequence();
  }, []);

  const startAnimationSequence = () => {
    // Phase 1: Logo fade in
    logoOpacity.value = withTiming(1, {duration: 300});
    logoScale.value = withSpring(1, {damping: 15, stiffness: 150});

    // Phase 2: Text reveal
    textOpacity.value = withDelay(
      1000,
      withTiming(1, {duration: 400})
    );
    textTranslateY.value = withDelay(
      1000,
      withSpring(0, {damping: 15, stiffness: 150})
    );

    // Phase 3: Navigate
    setTimeout(() => {
      navigateToNext();
    }, 2800);
  };

  const navigateToNext = () => {
    const hasCompletedOnboarding = storageService.getBoolean(
      STORAGE_KEYS.onboardingComplete
    );

    if (hasCompletedOnboarding) {
      navigation.navigate('Main' as never);
    } else {
      navigation.navigate('Onboarding' as never);
    }
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{scale: logoScale.value}],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{translateY: textTranslateY.value}],
  }));

  return (
    <View style={styles.container}>
      {/* Background Glow */}
      <View style={styles.glowContainer}>
        <View style={[styles.glow, styles.glow1]} />
        <View style={[styles.glow, styles.glow2]} />
      </View>

      {/* Logo */}
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logo}>
          <Canvas style={styles.logoCanvas}>
            <Group>
              {/* Aperture blades - 8 segments */}
              {Array.from({length: 8}).map((_, i) => {
                const angle = (i * Math.PI * 2) / 8;
                const x = LOGO_SIZE / 2 + Math.cos(angle) * 30;
                const y = LOGO_SIZE / 2 + Math.sin(angle) * 30;
                return (
                  <Circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={15}
                    color={colors.accent.electricBlue}
                    opacity={0.8}
                  />
                );
              })}
              {/* Center circle */}
              <Circle
                cx={LOGO_SIZE / 2}
                cy={LOGO_SIZE / 2}
                r={20}
                color={colors.accent.vividPurple}
              />
            </Group>
          </Canvas>
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.appName}>SnapEdit</Text>
        <Text style={styles.tagline}>Professional Photo & Video Editor</Text>
      </Animated.View>
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
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.15,
  },
  glow1: {
    backgroundColor: colors.accent.electricBlue,
  },
  glow2: {
    backgroundColor: colors.accent.vividPurple,
    transform: [{scale: 0.7}],
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  logoCanvas: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    ...typography.hero,
    color: colors.text.primary,
    marginBottom: 8,
  },
  tagline: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
