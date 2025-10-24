/**
 * Export Tool Component
 * Format, quality, and export options
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';

type ExportFormat = 'jpg' | 'png' | 'heic';
type QualityLevel = 'low' | 'medium' | 'high' | 'maximum';
type Resolution = 'original' | '4k' | '2k' | '1080p' | '720p';
type ColorProfile = 'sRGB' | 'display-p3';

interface FormatOption {
  id: ExportFormat;
  name: string;
  extension: string;
  description: string;
  icon: string;
  supportsTransparency: boolean;
}

interface QualityOption {
  id: QualityLevel;
  name: string;
  description: string;
  percentage: number;
}

interface ResolutionOption {
  id: Resolution;
  name: string;
  dimensions: string;
  fileSize: string;
}

const formats: FormatOption[] = [
  {
    id: 'jpg',
    name: 'JPEG',
    extension: '.jpg',
    description: 'Universal compatibility, smaller file size',
    icon: 'image',
    supportsTransparency: false,
  },
  {
    id: 'png',
    name: 'PNG',
    extension: '.png',
    description: 'Lossless quality, supports transparency',
    icon: 'albums',
    supportsTransparency: true,
  },
  {
    id: 'heic',
    name: 'HEIC',
    extension: '.heic',
    description: 'Modern format, excellent compression',
    icon: 'aperture',
    supportsTransparency: true,
  },
];

const qualities: QualityOption[] = [
  {
    id: 'low',
    name: 'Low',
    description: 'Smallest file size',
    percentage: 60,
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Balanced quality',
    percentage: 80,
  },
  {
    id: 'high',
    name: 'High',
    description: 'Great for sharing',
    percentage: 90,
  },
  {
    id: 'maximum',
    name: 'Maximum',
    description: 'Best quality',
    percentage: 100,
  },
];

const resolutions: ResolutionOption[] = [
  {
    id: 'original',
    name: 'Original',
    dimensions: 'Keep original size',
    fileSize: '~8 MB',
  },
  {
    id: '4k',
    name: '4K',
    dimensions: '3840 × 2160',
    fileSize: '~6 MB',
  },
  {
    id: '2k',
    name: '2K',
    dimensions: '2560 × 1440',
    fileSize: '~3 MB',
  },
  {
    id: '1080p',
    name: '1080p',
    dimensions: '1920 × 1080',
    fileSize: '~2 MB',
  },
  {
    id: '720p',
    name: '720p',
    dimensions: '1280 × 720',
    fileSize: '~1 MB',
  },
];

interface FormatCardProps {
  format: FormatOption;
  isSelected: boolean;
  onPress: () => void;
}

const FormatCard: React.FC<FormatCardProps> = ({format, isSelected, onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.formatCard,
        isSelected && styles.formatCardSelected,
      ]}
      onPress={onPress}>
      <Icon
        name={format.icon}
        size={32}
        color={isSelected ? colors.accent.electricBlue : colors.text.secondary}
      />
      <View style={styles.formatInfo}>
        <Text
          style={[
            styles.formatName,
            isSelected && styles.formatNameSelected,
          ]}>
          {format.name}
        </Text>
        <Text style={styles.formatDescription}>{format.description}</Text>
      </View>
      {isSelected && (
        <Icon name="checkmark-circle" size={24} color={colors.accent.electricBlue} />
      )}
    </TouchableOpacity>
  );
};

interface QualityButtonProps {
  quality: QualityOption;
  isSelected: boolean;
  onPress: () => void;
}

const QualityButton: React.FC<QualityButtonProps> = ({
  quality,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.qualityButton,
        isSelected && styles.qualityButtonSelected,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.qualityName,
          isSelected && styles.qualityNameSelected,
        ]}>
        {quality.name}
      </Text>
      <Text style={styles.qualityDescription}>{quality.description}</Text>
    </TouchableOpacity>
  );
};

interface ResolutionButtonProps {
  resolution: ResolutionOption;
  isSelected: boolean;
  onPress: () => void;
}

const ResolutionButton: React.FC<ResolutionButtonProps> = ({
  resolution,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.resolutionButton,
        isSelected && styles.resolutionButtonSelected,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.resolutionName,
          isSelected && styles.resolutionNameSelected,
        ]}>
        {resolution.name}
      </Text>
      <Text style={styles.resolutionDimensions}>{resolution.dimensions}</Text>
      <Text style={styles.resolutionFileSize}>{resolution.fileSize}</Text>
    </TouchableOpacity>
  );
};

export const ExportTool: React.FC = () => {
  const isPremium = useStore(state => state.isPremium);
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('jpg');
  const [selectedQuality, setSelectedQuality] = useState<QualityLevel>('high');
  const [selectedResolution, setSelectedResolution] = useState<Resolution>('original');
  const [removeWatermark, setRemoveWatermark] = useState(false);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [colorProfile, setColorProfile] = useState<ColorProfile>('sRGB');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Export settings:', {
        format: selectedFormat,
        quality: selectedQuality,
        resolution: selectedResolution,
        removeWatermark: isPremium && removeWatermark,
        preserveMetadata,
        colorProfile,
      });

      // Show success message or navigation
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [
    selectedFormat,
    selectedQuality,
    selectedResolution,
    removeWatermark,
    preserveMetadata,
    colorProfile,
    isPremium,
  ]);

  const estimatedFileSize = resolutions.find(r => r.id === selectedResolution)?.fileSize || '~2 MB';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Format Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Format</Text>
          <View style={styles.formatList}>
            {formats.map(format => (
              <FormatCard
                key={format.id}
                format={format}
                isSelected={selectedFormat === format.id}
                onPress={() => setSelectedFormat(format.id)}
              />
            ))}
          </View>
        </View>

        {/* Quality Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quality</Text>
          <View style={styles.qualityList}>
            {qualities.map(quality => (
              <QualityButton
                key={quality.id}
                quality={quality}
                isSelected={selectedQuality === quality.id}
                onPress={() => setSelectedQuality(quality.id)}
              />
            ))}
          </View>
        </View>

        {/* Resolution Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resolution</Text>
          <View style={styles.resolutionList}>
            {resolutions.map(resolution => (
              <ResolutionButton
                key={resolution.id}
                resolution={resolution}
                isSelected={selectedResolution === resolution.id}
                onPress={() => setSelectedResolution(resolution.id)}
              />
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          {/* Remove Watermark (Premium) */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => isPremium && setRemoveWatermark(!removeWatermark)}
            disabled={!isPremium}>
            <View style={styles.settingInfo}>
              <Icon
                name="water"
                size={20}
                color={isPremium ? colors.text.secondary : colors.text.tertiary}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, !isPremium && styles.settingLabelDisabled]}>
                  Remove Watermark
                </Text>
                {!isPremium && (
                  <Text style={styles.settingPremium}>Premium Feature</Text>
                )}
              </View>
            </View>
            <View
              style={[
                styles.toggle,
                removeWatermark && isPremium && styles.toggleActive,
                !isPremium && styles.toggleDisabled,
              ]}>
              <View
                style={[
                  styles.toggleThumb,
                  removeWatermark && isPremium && styles.toggleThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Preserve Metadata */}
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setPreserveMetadata(!preserveMetadata)}>
            <View style={styles.settingInfo}>
              <Icon name="information-circle" size={20} color={colors.text.secondary} />
              <Text style={styles.settingLabel}>Preserve Metadata</Text>
            </View>
            <View
              style={[
                styles.toggle,
                preserveMetadata && styles.toggleActive,
              ]}>
              <View
                style={[
                  styles.toggleThumb,
                  preserveMetadata && styles.toggleThumbActive,
                ]}
              />
            </View>
          </TouchableOpacity>

          {/* Color Profile */}
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="color-palette" size={20} color={colors.text.secondary} />
              <Text style={styles.settingLabel}>Color Profile</Text>
            </View>
            <View style={styles.colorProfileButtons}>
              <TouchableOpacity
                style={[
                  styles.colorProfileButton,
                  colorProfile === 'sRGB' && styles.colorProfileButtonActive,
                ]}
                onPress={() => setColorProfile('sRGB')}>
                <Text
                  style={[
                    styles.colorProfileText,
                    colorProfile === 'sRGB' && styles.colorProfileTextActive,
                  ]}>
                  sRGB
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.colorProfileButton,
                  colorProfile === 'display-p3' && styles.colorProfileButtonActive,
                ]}
                onPress={() => setColorProfile('display-p3')}>
                <Text
                  style={[
                    styles.colorProfileText,
                    colorProfile === 'display-p3' && styles.colorProfileTextActive,
                  ]}>
                  P3
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Export Info */}
        <View style={styles.exportInfo}>
          <View style={styles.exportInfoRow}>
            <Icon name="document" size={18} color={colors.text.tertiary} />
            <Text style={styles.exportInfoText}>
              Format: {formats.find(f => f.id === selectedFormat)?.name}
            </Text>
          </View>
          <View style={styles.exportInfoRow}>
            <Icon name="resize" size={18} color={colors.text.tertiary} />
            <Text style={styles.exportInfoText}>
              Est. Size: {estimatedFileSize}
            </Text>
          </View>
          <View style={styles.exportInfoRow}>
            <Icon name="speedometer" size={18} color={colors.text.tertiary} />
            <Text style={styles.exportInfoText}>
              Quality: {qualities.find(q => q.id === selectedQuality)?.percentage}%
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Export Button */}
      <View style={styles.exportButtonContainer}>
        <TouchableOpacity
          style={styles.exportButton}
          onPress={handleExport}
          disabled={isExporting}
          activeOpacity={0.9}>
          <LinearGradient
            colors={[colors.accent.emeraldGreen, colors.accent.electricBlue]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.exportButtonGradient}>
            {isExporting ? (
              <ActivityIndicator color={colors.semantic.neutralWhite} />
            ) : (
              <>
                <Icon name="download" size={24} color={colors.semantic.neutralWhite} />
                <Text style={styles.exportButtonText}>Export Image</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton} disabled={isExporting}>
          <Icon name="share" size={20} color={colors.accent.electricBlue} />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  section: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  formatList: {
    gap: spacing.sm,
  },
  formatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formatCardSelected: {
    borderColor: colors.accent.electricBlue,
    backgroundColor: colors.accent.electricBlue + '10',
  },
  formatInfo: {
    flex: 1,
    gap: 4,
  },
  formatName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  formatNameSelected: {
    color: colors.accent.electricBlue,
  },
  formatDescription: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  qualityList: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  qualityButton: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  qualityButtonSelected: {
    borderColor: colors.accent.electricBlue,
    backgroundColor: colors.accent.electricBlue + '10',
  },
  qualityName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  qualityNameSelected: {
    color: colors.accent.electricBlue,
  },
  qualityDescription: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.tertiary,
  },
  resolutionList: {
    gap: spacing.sm,
  },
  resolutionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  resolutionButtonSelected: {
    borderColor: colors.accent.electricBlue,
    backgroundColor: colors.accent.electricBlue + '10',
  },
  resolutionName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    minWidth: 80,
  },
  resolutionNameSelected: {
    color: colors.accent.electricBlue,
  },
  resolutionDimensions: {
    ...typography.caption,
    color: colors.text.tertiary,
    flex: 1,
  },
  resolutionFileSize: {
    ...typography.caption,
    color: colors.text.tertiary,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  settingText: {
    gap: 2,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  settingLabelDisabled: {
    color: colors.text.tertiary,
  },
  settingPremium: {
    ...typography.caption,
    fontSize: 10,
    color: colors.accent.vividPurple,
    fontWeight: '600',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary.steelGray,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: colors.accent.electricBlue,
  },
  toggleDisabled: {
    opacity: 0.3,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.semantic.neutralWhite,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  colorProfileButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  colorProfileButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
    backgroundColor: colors.overlay.light,
  },
  colorProfileButtonActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  colorProfileText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  colorProfileTextActive: {
    color: colors.accent.electricBlue,
  },
  exportInfo: {
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
    gap: spacing.sm,
  },
  exportInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  exportInfoText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  exportButtonContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.default,
  },
  exportButton: {
    borderRadius: borderRadius.button,
    overflow: 'hidden',
    ...shadows.medium,
  },
  exportButtonGradient: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  exportButtonText: {
    ...typography.bodyLarge,
    color: colors.semantic.neutralWhite,
    fontWeight: '700',
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  shareButtonText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
});
