/**
 * Onboarding Screen - Complete Implementation
 * Phase 7: 3-screen flow with animations
 */

import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius} from '@theme';
import {Button} from '@components/common';
import {storageService} from '@services/storage';
import {STORAGE_KEYS} from '@constants';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  gradientColors: string[];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Professional Editing,\nNo Limits',
    subtitle: 'Powerful photo and video tools that work entirely on your device',
    icon: 'images',
    gradientColors: [colors.accent.vividPurple, colors.accent.electricBlue],
  },
  {
    id: '2',
    title: 'Everything\nYou Need',
    subtitle: 'Filters, adjustments, curves, HSL, drawing tools, and more',
    icon: 'color-filter',
    gradientColors: [colors.accent.electricBlue, colors.accent.emeraldGreen],
  },
  {
    id: '3',
    title: 'Start Creating\nNow',
    subtitle: 'Free tools included. Unlock premium features anytime.',
    icon: 'sparkles',
    gradientColors: [colors.accent.emeraldGreen, colors.accent.vividPurple],
  },
];

const OnboardingSlideComponent: React.FC<{
  item: OnboardingSlide;
  index: number;
  scrollX: Animated.SharedValue<number>;
}> = ({item, index, scrollX}) => {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [50, 0, -50],
      Extrapolate.CLAMP
    );

    return {
      opacity,
      transform: [{translateY}],
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolate.CLAMP
    );

    const rotate = interpolate(
      scrollX.value,
      inputRange,
      [-10, 0, 10],
      Extrapolate.CLAMP
    );

    return {
      transform: [{scale}, {rotate: `${rotate}deg`}],
    };
  });

  return (
    <View style={styles.slide}>
      <LinearGradient
        colors={item.gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}
      />

      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        <View style={styles.iconCircle}>
          <Icon name={item.icon} size={80} color={colors.semantic.neutralWhite} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.textContainer, titleAnimatedStyle]}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </View>
  );
};

const PageIndicator: React.FC<{
  index: number;
  currentIndex: number;
}> = ({index, currentIndex}) => {
  const isActive = index === currentIndex;

  const animatedStyle = useAnimatedStyle(() => {
    const width = withSpring(isActive ? 24 : 8, {damping: 15, stiffness: 150});
    const opacity = withTiming(isActive ? 1 : 0.5, {duration: 200});

    return {
      width,
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.indicator,
        {backgroundColor: colors.accent.electricBlue},
        animatedStyle,
      ]}
    />
  );
};

export const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    storageService.setBoolean(STORAGE_KEYS.onboardingComplete, true);
    navigation.navigate('Main' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Skip Button */}
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({item, index}) => (
          <OnboardingSlideComponent
            item={item}
            index={index}
            scrollX={scrollX}
          />
        )}
      />

      {/* Page Indicators */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, index) => (
          <PageIndicator key={index} index={index} currentIndex={currentIndex} />
        ))}
      </View>

      {/* Action Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          variant="primary"
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
  },
  skipButton: {
    position: 'absolute',
    top: 20,
    right: spacing.screenPadding,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  slide: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 200,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  iconContainer: {
    marginBottom: spacing.xxxl,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.hero,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.text.tertiary,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
});
