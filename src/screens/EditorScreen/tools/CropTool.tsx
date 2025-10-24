/**
 * Crop Tool Component
 * Gesture-based cropping with aspect ratios
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius} from '@theme';
import {useStore} from '@/store';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type AspectRatio = 'original' | 'square' | '4:3' | '3:2' | '16:9' | '9:16' | 'custom';

interface AspectRatioDefinition {
  id: AspectRatio;
  name: string;
  ratio?: number; // width / height, undefined for original/custom
  icon: string;
}

const aspectRatios: AspectRatioDefinition[] = [
  {id: 'original', name: 'Original', icon: 'image'},
  {id: 'square', name: '1:1', ratio: 1, icon: 'square'},
  {id: '4:3', name: '4:3', ratio: 4 / 3, icon: 'tablet-landscape'},
  {id: '3:2', name: '3:2', ratio: 3 / 2, icon: 'camera'},
  {id: '16:9', name: '16:9', ratio: 16 / 9, icon: 'tv'},
  {id: '9:16', name: '9:16', ratio: 9 / 16, icon: 'phone-portrait'},
  {id: 'custom', name: 'Custom', icon: 'resize'},
];

interface CropState {
  rotation: number; // 0, 90, 180, 270
  flipHorizontal: boolean;
  flipVertical: boolean;
  aspectRatio: AspectRatio;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}

interface AspectRatioButtonProps {
  aspectRatio: AspectRatioDefinition;
  isActive: boolean;
  onPress: () => void;
}

const AspectRatioButton: React.FC<AspectRatioButtonProps> = ({
  aspectRatio,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.aspectRatioButton,
        isActive && styles.aspectRatioButtonActive,
      ]}
      onPress={onPress}>
      <Icon
        name={aspectRatio.icon}
        size={24}
        color={isActive ? colors.accent.electricBlue : colors.text.secondary}
      />
      <Text
        style={[
          styles.aspectRatioName,
          isActive && styles.aspectRatioNameActive,
        ]}>
        {aspectRatio.name}
      </Text>
    </TouchableOpacity>
  );
};

interface ActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({icon, label, onPress}) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Icon name={icon} size={24} color={colors.text.primary} />
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

export const CropTool: React.FC = () => {
  const [cropState, setCropState] = useState<CropState>({
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
    aspectRatio: 'original',
    cropX: 0,
    cropY: 0,
    cropWidth: 100,
    cropHeight: 100,
  });
  const [showGrid, setShowGrid] = useState(true);

  const handleAspectRatioChange = useCallback((ratio: AspectRatio) => {
    setCropState(prev => ({...prev, aspectRatio: ratio}));
  }, []);

  const handleRotateLeft = useCallback(() => {
    setCropState(prev => ({
      ...prev,
      rotation: (prev.rotation - 90 + 360) % 360,
    }));
  }, []);

  const handleRotateRight = useCallback(() => {
    setCropState(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  }, []);

  const handleFlipHorizontal = useCallback(() => {
    setCropState(prev => ({
      ...prev,
      flipHorizontal: !prev.flipHorizontal,
    }));
  }, []);

  const handleFlipVertical = useCallback(() => {
    setCropState(prev => ({
      ...prev,
      flipVertical: !prev.flipVertical,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setCropState({
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
      aspectRatio: 'original',
      cropX: 0,
      cropY: 0,
      cropWidth: 100,
      cropHeight: 100,
    });
  }, []);

  const hasModifications =
    cropState.rotation !== 0 ||
    cropState.flipHorizontal ||
    cropState.flipVertical ||
    cropState.aspectRatio !== 'original';

  return (
    <View style={styles.container}>
      {/* Crop Preview Info */}
      <View style={styles.cropInfo}>
        <View style={styles.cropInfoRow}>
          <Icon name="crop" size={20} color={colors.text.secondary} />
          <Text style={styles.cropInfoText}>
            {cropState.cropWidth}% × {cropState.cropHeight}%
          </Text>
        </View>
        {cropState.rotation !== 0 && (
          <View style={styles.cropInfoRow}>
            <Icon name="sync" size={20} color={colors.text.secondary} />
            <Text style={styles.cropInfoText}>{cropState.rotation}°</Text>
          </View>
        )}
        {(cropState.flipHorizontal || cropState.flipVertical) && (
          <View style={styles.cropInfoRow}>
            <Icon name="swap-horizontal" size={20} color={colors.text.secondary} />
            <Text style={styles.cropInfoText}>Flipped</Text>
          </View>
        )}
      </View>

      {/* Aspect Ratios */}
      <View style={styles.aspectRatiosContainer}>
        <Text style={styles.sectionTitle}>Aspect Ratio</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.aspectRatiosList}>
          {aspectRatios.map(ratio => (
            <AspectRatioButton
              key={ratio.id}
              aspectRatio={ratio}
              isActive={cropState.aspectRatio === ratio.id}
              onPress={() => handleAspectRatioChange(ratio.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Crop Canvas Placeholder */}
      <View style={styles.cropCanvasPlaceholder}>
        <View
          style={[
            styles.cropFrame,
            {
              transform: [
                {rotate: `${cropState.rotation}deg`},
                {scaleX: cropState.flipHorizontal ? -1 : 1},
                {scaleY: cropState.flipVertical ? -1 : 1},
              ],
            },
          ]}>
          <Icon name="image" size={48} color={colors.text.tertiary} />

          {/* Grid overlay (Rule of Thirds) */}
          {showGrid && (
            <View style={styles.gridOverlay}>
              {/* Vertical lines */}
              <View style={[styles.gridLine, {left: '33.33%'}]} />
              <View style={[styles.gridLine, {left: '66.66%'}]} />
              {/* Horizontal lines */}
              <View style={[styles.gridLine, {top: '33.33%', width: '100%', height: 1}]} />
              <View style={[styles.gridLine, {top: '66.66%', width: '100%', height: 1}]} />
            </View>
          )}

          {/* Corner handles */}
          <View style={[styles.handle, styles.handleTopLeft]} />
          <View style={[styles.handle, styles.handleTopRight]} />
          <View style={[styles.handle, styles.handleBottomLeft]} />
          <View style={[styles.handle, styles.handleBottomRight]} />
        </View>

        <Text style={styles.cropHint}>
          Drag corners to crop • Pinch to zoom
        </Text>
      </View>

      {/* Transform Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Transform</Text>
        <View style={styles.actionsList}>
          <ActionButton
            icon="sync"
            label="Rotate Left"
            onPress={handleRotateLeft}
          />
          <ActionButton
            icon="sync"
            label="Rotate Right"
            onPress={handleRotateRight}
          />
          <ActionButton
            icon="swap-horizontal"
            label="Flip H"
            onPress={handleFlipHorizontal}
          />
          <ActionButton
            icon="swap-vertical"
            label="Flip V"
            onPress={handleFlipVertical}
          />
        </View>
      </View>

      {/* Settings */}
      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => setShowGrid(!showGrid)}>
          <View style={styles.settingInfo}>
            <Icon name="grid" size={20} color={colors.text.secondary} />
            <Text style={styles.settingLabel}>Show Grid</Text>
          </View>
          <View
            style={[
              styles.toggle,
              showGrid && styles.toggleActive,
            ]}>
            <View
              style={[
                styles.toggleThumb,
                showGrid && styles.toggleThumbActive,
              ]}
            />
          </View>
        </TouchableOpacity>

        {hasModifications && (
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Icon name="refresh" size={20} color={colors.accent.electricBlue} />
            <Text style={styles.resetText}>Reset All</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
  },
  cropInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  cropInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cropInfoText: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  aspectRatiosContainer: {
    gap: spacing.sm,
  },
  aspectRatiosList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  aspectRatioButton: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
    minWidth: 70,
  },
  aspectRatioButtonActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  aspectRatioName: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  aspectRatioNameActive: {
    color: colors.accent.electricBlue,
  },
  cropCanvasPlaceholder: {
    alignSelf: 'center',
    width: SCREEN_WIDTH - spacing.screenPadding * 2,
    height: 200,
    borderRadius: borderRadius.card,
    backgroundColor: colors.primary.carbonGray,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  cropFrame: {
    width: '80%',
    height: '80%',
    borderWidth: 2,
    borderColor: colors.accent.electricBlue,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: colors.semantic.neutralWhite,
    opacity: 0.3,
    width: 1,
    height: '100%',
  },
  handle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: colors.semantic.neutralWhite,
    backgroundColor: colors.accent.electricBlue,
    borderRadius: 10,
  },
  handleTopLeft: {
    top: -10,
    left: -10,
  },
  handleTopRight: {
    top: -10,
    right: -10,
  },
  handleBottomLeft: {
    bottom: -10,
    left: -10,
  },
  handleBottomRight: {
    bottom: -10,
    right: -10,
  },
  cropHint: {
    position: 'absolute',
    bottom: spacing.sm,
    ...typography.caption,
    color: colors.text.tertiary,
  },
  actionsContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  actionsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  settingsContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
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
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.semantic.neutralWhite,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  resetButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  resetText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
});
