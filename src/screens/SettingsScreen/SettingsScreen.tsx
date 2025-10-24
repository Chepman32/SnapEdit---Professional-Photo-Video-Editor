/**
 * Settings Screen - Complete Implementation
 * Phase 20: Complete settings with all preferences
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';
import {fileSystemService} from '@services/fileSystem';

interface SettingRowProps {
  icon: string;
  label: string;
  value?: string | number | boolean;
  onPress?: () => void;
  showChevron?: boolean;
  isSwitch?: boolean;
  onValueChange?: (value: boolean) => void;
  destructive?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  isSwitch = false,
  onValueChange,
  destructive = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={isSwitch}
      activeOpacity={0.7}>
      <View style={styles.settingLeft}>
        <Icon
          name={icon}
          size={24}
          color={destructive ? colors.accent.coralRed : colors.text.primary}
        />
        <Text
          style={[
            styles.settingLabel,
            destructive && {color: colors.accent.coralRed},
          ]}>
          {label}
        </Text>
      </View>
      <View style={styles.settingRight}>
        {isSwitch && typeof value === 'boolean' ? (
          <Switch
            value={value}
            onValueChange={onValueChange}
            trackColor={{
              false: colors.border.default,
              true: colors.accent.electricBlue,
            }}
            thumbColor={colors.semantic.neutralWhite}
          />
        ) : (
          <>
            {value !== undefined && typeof value !== 'boolean' && (
              <Text style={styles.settingValue}>{value}</Text>
            )}
            {showChevron && (
              <Icon
                name="chevron-forward"
                size={20}
                color={colors.text.tertiary}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const SectionHeader: React.FC<{title: string}> = ({title}) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const [cacheSize, setCacheSize] = useState<string>('0 MB');

  const user = useStore(state => state.user);
  const isPremium = useStore(state => state.isPremium);
  const settings = useStore(state => state.settings);
  const updateSetting = useStore(state => state.updateSetting);
  const logout = useStore(state => state.logout);

  React.useEffect(() => {
    loadCacheSize();
  }, []);

  const loadCacheSize = async () => {
    const size = await fileSystemService.getCacheSize();
    setCacheSize(fileSystemService.formatBytes(size));
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached thumbnails and filters. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await fileSystemService.clearCache();
            await loadCacheSize();
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          logout();
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={colors.accent.electricBlue} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{width: 28}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile */}
        {user && (
          <View style={styles.profileSection}>
            <View style={styles.profileAvatar}>
              <Icon
                name="person"
                size={40}
                color={colors.accent.electricBlue}
              />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name || 'User'}</Text>
              <Text style={styles.profileEmail}>{user.email || ''}</Text>
            </View>
            {isPremium && (
              <View style={styles.premiumBadge}>
                <Icon name="diamond" size={16} color={colors.accent.vividPurple} />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            )}
          </View>
        )}

        {/* Premium Section */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumSection}
            onPress={() => navigation.navigate('Paywall' as never)}
            activeOpacity={0.9}>
            <LinearGradient
              colors={[colors.accent.vividPurple, colors.accent.electricBlue]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.premiumGradient}>
              <Icon name="diamond" size={40} color={colors.semantic.neutralWhite} />
              <View style={styles.premiumContent}>
                <Text style={styles.premiumTitle}>SnapEdit Premium</Text>
                <Text style={styles.premiumSubtitle}>Unlock all features</Text>
              </View>
              <Icon
                name="chevron-forward"
                size={24}
                color={colors.semantic.neutralWhite}
              />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* General Settings */}
        <SectionHeader title="GENERAL" />
        <View style={styles.section}>
          <SettingRow
            icon="language"
            label="Language"
            value={settings.language.toUpperCase()}
            onPress={() => console.log('Language selection')}
          />
          <SettingRow
            icon="phone-portrait"
            label="Haptic Feedback"
            value={settings.hapticEnabled}
            isSwitch
            onValueChange={(value) => updateSetting('hapticEnabled', value)}
            showChevron={false}
          />
          <SettingRow
            icon="volume-high"
            label="Sound Effects"
            value={settings.soundEnabled}
            isSwitch
            onValueChange={(value) => updateSetting('soundEnabled', value)}
            showChevron={false}
          />
        </View>

        {/* Editing Settings */}
        <SectionHeader title="EDITING" />
        <View style={styles.section}>
          <SettingRow
            icon="document"
            label="Default Export Format"
            value={settings.exportFormat.toUpperCase()}
            onPress={() => console.log('Format selection')}
          />
          <SettingRow
            icon="aperture"
            label="Export Quality"
            value={`${settings.exportQuality}%`}
            onPress={() => console.log('Quality selection')}
          />
          <SettingRow
            icon="save"
            label="Auto-Save Edits"
            value={settings.autoSaveEdits}
            isSwitch
            onValueChange={(value) => updateSetting('autoSaveEdits', value)}
            showChevron={false}
          />
          <SettingRow
            icon="grid"
            label="Show Grid When Cropping"
            value={settings.showGridWhenCropping}
            isSwitch
            onValueChange={(value) => updateSetting('showGridWhenCropping', value)}
            showChevron={false}
          />
        </View>

        {/* Storage */}
        <SectionHeader title="STORAGE" />
        <View style={styles.section}>
          <SettingRow
            icon="folder"
            label="Cache Size"
            value={cacheSize}
            showChevron={false}
          />
          <SettingRow
            icon="trash"
            label="Clear Cache"
            onPress={handleClearCache}
          />
        </View>

        {/* About */}
        <SectionHeader title="ABOUT" />
        <View style={styles.section}>
          <SettingRow
            icon="information-circle"
            label="Version"
            value="1.0.0"
            showChevron={false}
          />
          <SettingRow
            icon="star"
            label="Rate App"
            onPress={() => console.log('Rate app')}
          />
          <SettingRow
            icon="document-text"
            label="Privacy Policy"
            onPress={() => console.log('Privacy Policy')}
          />
          <SettingRow
            icon="shield-checkmark"
            label="Terms of Service"
            onPress={() => console.log('Terms of Service')}
          />
        </View>

        {/* Support */}
        <SectionHeader title="SUPPORT" />
        <View style={styles.section}>
          <SettingRow
            icon="help-circle"
            label="Help Center"
            onPress={() => console.log('Help')}
          />
          <SettingRow
            icon="mail"
            label="Contact Support"
            onPress={() => console.log('Contact')}
          />
          <SettingRow
            icon="bug"
            label="Report a Bug"
            onPress={() => console.log('Report bug')}
          />
        </View>

        {/* Account Actions */}
        {user && (
          <View style={styles.section}>
            <SettingRow
              icon="log-out"
              label="Sign Out"
              onPress={handleLogout}
              destructive
              showChevron={false}
            />
          </View>
        )}

        <View style={{height: spacing.xxl}} />
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    backgroundColor: colors.primary.carbonGray,
    borderRadius: borderRadius.card,
    ...shadows.subtle,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent.electricBlue + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  profileName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  premiumSection: {
    marginHorizontal: spacing.screenPadding,
    marginVertical: spacing.md,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    ...shadows.medium,
  },
  premiumGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    ...typography.h3,
    color: colors.semantic.neutralWhite,
    marginBottom: 4,
  },
  premiumSubtitle: {
    ...typography.body,
    color: colors.semantic.neutralWhite,
    opacity: 0.9,
  },
  sectionHeader: {
    ...typography.label,
    color: colors.text.tertiary,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  section: {
    marginHorizontal: spacing.screenPadding,
    backgroundColor: colors.primary.carbonGray,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text.primary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValue: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
