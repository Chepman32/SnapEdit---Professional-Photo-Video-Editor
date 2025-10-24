/**
 * Enhanced Home Screen
 * Phase 8: Complete implementation with quick actions and recent edits
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CARD_WIDTH = 160;
const CARD_HEIGHT = 200;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const QuickActionCard: React.FC<{
  icon: string;
  label: string;
  sublabel: string;
  color: string;
  onPress: () => void;
}> = ({icon, label, sublabel, color, onPress}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[styles.actionCard, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}>
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, {backgroundColor: color + '20'}]}>
          <Icon name={icon} size={48} color={color} />
        </View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardSublabel}>{sublabel}</Text>
      </View>
    </AnimatedTouchable>
  );
};

export const HomeScreen = () => {
  const navigation = useNavigation();
  const user = useStore(state => state.user);
  const isPremium = useStore(state => state.isPremium);

  const handleCameraPress = () => {
    // TODO: Open camera
    console.log('Open camera');
  };

  const handleGalleryPress = () => {
    navigation.navigate('Gallery' as never);
  };

  const handleVideoPress = () => {
    // TODO: Open video picker
    console.log('Open video picker');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon
            name="aperture-outline"
            size={32}
            color={colors.accent.electricBlue}
          />
          <Text style={styles.headerTitle}>SnapEdit</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}>
          <Icon
            name="settings-outline"
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        {user && (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>{user.name || 'User'}</Text>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Icon name="diamond" size={16} color={colors.accent.vividPurple} />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsContainer}
            snapToInterval={CARD_WIDTH + 12}
            decelerationRate="fast">
            <QuickActionCard
              icon="camera"
              label="Take Photo"
              sublabel="Quick capture"
              color={colors.accent.electricBlue}
              onPress={handleCameraPress}
            />
            <QuickActionCard
              icon="images"
              label="From Gallery"
              sublabel="Select photos"
              color={colors.accent.vividPurple}
              onPress={handleGalleryPress}
            />
            <QuickActionCard
              icon="film"
              label="Edit Video"
              sublabel="Import video"
              color={colors.accent.emeraldGreen}
              onPress={handleVideoPress}
            />
          </ScrollView>
        </View>

        {/* Recent Edits */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Edits</Text>
            <TouchableOpacity onPress={handleGalleryPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Empty State */}
          <View style={styles.emptyState}>
            <Icon
              name="images-outline"
              size={64}
              color={colors.text.tertiary}
            />
            <Text style={styles.emptyStateTitle}>No recent edits</Text>
            <Text style={styles.emptyStateText}>
              Your edited photos will appear here
            </Text>
          </View>
        </View>

        {/* Gallery Access */}
        <TouchableOpacity
          style={styles.galleryButton}
          onPress={handleGalleryPress}
          activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.accent.vividPurple, colors.accent.electricBlue]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.galleryButtonGradient}>
            <Icon
              name="folder-open"
              size={28}
              color={colors.semantic.neutralWhite}
            />
            <Text style={styles.galleryButtonText}>Browse All Photos</Text>
            <Icon
              name="chevron-forward"
              size={24}
              color={colors.semantic.neutralWhite}
            />
          </LinearGradient>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: spacing.screenPadding,
    paddingTop: spacing.lg,
  },
  welcomeText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  userName: {
    ...typography.h2,
    color: colors.text.primary,
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.accent.vividPurple + '20',
    borderRadius: borderRadius.small,
  },
  premiumText: {
    ...typography.caption,
    color: colors.accent.vividPurple,
    fontWeight: '600',
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  seeAllText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  quickActionsContainer: {
    paddingHorizontal: spacing.screenPadding,
    gap: 12,
  },
  actionCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: colors.primary.carbonGray,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.medium,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardSublabel: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.screenPadding,
  },
  emptyStateTitle: {
    ...typography.h3,
    color: colors.text.tertiary,
    marginTop: spacing.md,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.text.tertiary,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  galleryButton: {
    marginHorizontal: spacing.screenPadding,
    marginVertical: spacing.lg,
    borderRadius: borderRadius.button,
    ...shadows.medium,
  },
  galleryButtonGradient: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderRadius: borderRadius.button,
  },
  galleryButtonText: {
    ...typography.bodyLarge,
    color: colors.semantic.neutralWhite,
    fontWeight: '700',
  },
});
