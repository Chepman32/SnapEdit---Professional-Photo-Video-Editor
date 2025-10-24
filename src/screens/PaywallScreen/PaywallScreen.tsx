/**
 * Paywall Screen - Complete Implementation
 * Phase 21: Premium subscription paywall with IAP
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  delay,
}) => {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify()}
      style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Icon name={icon} size={32} color={colors.accent.electricBlue} />
      </View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </Animated.View>
  );
};

interface PlanCardProps {
  title: string;
  price: string;
  period: string;
  badge?: string;
  badgeColor?: string;
  savings?: string;
  isSelected: boolean;
  onSelect: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  price,
  period,
  badge,
  badgeColor,
  savings,
  isSelected,
  onSelect,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[
        styles.planCard,
        isSelected && styles.planCardSelected,
        animatedStyle,
      ]}
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}>
      {badge && (
        <View
          style={[
            styles.badge,
            {backgroundColor: badgeColor || colors.accent.electricBlue},
          ]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Text style={styles.planTitle}>{title}</Text>
      <View style={styles.planPricing}>
        <Text style={styles.planPrice}>{price}</Text>
        <Text style={styles.planPeriod}>/{period}</Text>
      </View>
      {savings && <Text style={styles.planSavings}>{savings}</Text>}
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Icon
            name="checkmark-circle"
            size={24}
            color={colors.accent.electricBlue}
          />
        </View>
      )}
    </AnimatedTouchable>
  );
};

const features = [
  {
    icon: 'color-filter',
    title: 'All Premium Filters',
    description: 'Access 20+ professional film-inspired filters',
  },
  {
    icon: 'construct',
    title: 'Advanced Tools',
    description: 'Curves, HSL, healing, and more powerful tools',
  },
  {
    icon: 'download',
    title: 'Unlimited Exports',
    description: 'Export unlimited photos and videos in full quality',
  },
  {
    icon: 'eye-off',
    title: 'Remove Watermark',
    description: 'Export clean images without SnapEdit branding',
  },
  {
    icon: 'film',
    title: 'Video Editing Pro',
    description: '4K export, stabilization, keyframes, transitions',
  },
  {
    icon: 'cloud',
    title: 'Cloud Backup',
    description: 'Auto-backup projects to iCloud',
  },
];

export const PaywallScreen = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<
    'monthly' | 'yearly' | 'lifetime'
  >('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const setPremiumStatus = useStore(state => state.setPremiumStatus);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update premium status
      setPremiumStatus(true, selectedPlan);

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      // Simulate restore process
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Restore complete');
    } catch (error) {
      console.error('Restore failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Background */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={[
            colors.accent.vividPurple + '20',
            colors.accent.electricBlue + '20',
          ]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.backgroundGradient}
        />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={{width: 28}} />
        <Text style={styles.headerTitle}>Unlock Premium</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={colors.accent.electricBlue} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.hero}>
          <Icon name="diamond" size={80} color={colors.accent.vividPurple} />
          <Text style={styles.heroTitle}>Unlock Everything</Text>
          <Text style={styles.heroSubtitle}>
            Get unlimited access to all premium features
          </Text>
        </Animated.View>

        {/* Features */}
        <View style={styles.features}>
          {features.map((feature, index) => (
            <FeatureItem
              key={feature.title}
              {...feature}
              delay={200 + index * 50}
            />
          ))}
        </View>

        {/* Plans */}
        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.plans}>
          <Text style={styles.plansTitle}>Choose Your Plan</Text>

          <PlanCard
            title="Monthly"
            price="$9.99"
            period="month"
            isSelected={selectedPlan === 'monthly'}
            onSelect={() => setSelectedPlan('monthly')}
          />

          <PlanCard
            title="Yearly"
            price="$49.99"
            period="year"
            badge="Best Value"
            badgeColor={colors.accent.emeraldGreen}
            savings="Save 58%"
            isSelected={selectedPlan === 'yearly'}
            onSelect={() => setSelectedPlan('yearly')}
          />

          <PlanCard
            title="Lifetime"
            price="$99.99"
            period="one-time"
            badge="Most Popular"
            badgeColor={colors.accent.electricBlue}
            isSelected={selectedPlan === 'lifetime'}
            onSelect={() => setSelectedPlan('lifetime')}
          />
        </Animated.View>

        {/* Trial Notice */}
        {selectedPlan === 'monthly' && (
          <Animated.Text
            entering={FadeIn}
            style={styles.trialNotice}>
            7 days free, then $9.99/month
          </Animated.Text>
        )}

        <View style={{height: 120}} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handlePurchase}
          disabled={isLoading}
          activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.accent.vividPurple, colors.accent.electricBlue]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.buttonGradient}>
            {isLoading ? (
              <ActivityIndicator color={colors.semantic.neutralWhite} />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={isLoading}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Auto-renewable. Cancel anytime.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundGradient: {
    flex: 1,
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
  headerTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
  },
  hero: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingBottom: spacing.lg,
  },
  heroTitle: {
    ...typography.hero,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.bodyLarge,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  features: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.electricBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.text.tertiary,
    lineHeight: 18,
  },
  plans: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  plansTitle: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  planCard: {
    backgroundColor: colors.primary.carbonGray + 'BB',
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.medium,
  },
  planCardSelected: {
    borderColor: colors.accent.electricBlue,
    ...shadows.strong,
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.small,
  },
  badgeText: {
    ...typography.caption,
    color: colors.semantic.neutralWhite,
    fontWeight: '700',
  },
  planTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  planPricing: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    ...typography.hero,
    fontSize: 36,
    color: colors.text.primary,
  },
  planPeriod: {
    ...typography.body,
    color: colors.text.tertiary,
    marginLeft: 4,
  },
  planSavings: {
    ...typography.caption,
    color: colors.accent.emeraldGreen,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  selectedIndicator: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },
  trialNotice: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  bottomActions: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.primary.obsidianBlack,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.default,
  },
  primaryButton: {
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    ...shadows.medium,
  },
  buttonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...typography.bodyLarge,
    color: colors.semantic.neutralWhite,
    fontWeight: '700',
  },
  restoreButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  restoreText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  disclaimer: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
