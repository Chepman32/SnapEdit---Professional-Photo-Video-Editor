/**
 * HSL Tool Component (Premium)
 * Selective color adjustments for 8 color ranges
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, borderRadius} from '@theme';
import {useStore} from '@/store';

type ColorRange = 'red' | 'orange' | 'yellow' | 'green' | 'cyan' | 'blue' | 'purple' | 'magenta';

interface HSLAdjustment {
  hue: number; // -180 to +180
  saturation: number; // -100 to +100
  luminance: number; // -100 to +100
}

interface ColorRangeDefinition {
  id: ColorRange;
  name: string;
  color: string;
  gradientColors: string[];
}

const colorRanges: ColorRangeDefinition[] = [
  {
    id: 'red',
    name: 'Red',
    color: '#FF3B30',
    gradientColors: ['#FF3B30', '#FF6259'],
  },
  {
    id: 'orange',
    name: 'Orange',
    color: '#FF9500',
    gradientColors: ['#FF9500', '#FFB340'],
  },
  {
    id: 'yellow',
    name: 'Yellow',
    color: '#FFCC00',
    gradientColors: ['#FFCC00', '#FFD740'],
  },
  {
    id: 'green',
    name: 'Green',
    color: '#34C759',
    gradientColors: ['#34C759', '#5DD17B'],
  },
  {
    id: 'cyan',
    name: 'Cyan',
    color: '#5AC8FA',
    gradientColors: ['#5AC8FA', '#7DD5FB'],
  },
  {
    id: 'blue',
    name: 'Blue',
    color: '#007AFF',
    gradientColors: ['#007AFF', '#3395FF'],
  },
  {
    id: 'purple',
    name: 'Purple',
    color: '#AF52DE',
    gradientColors: ['#AF52DE', '#C074E4'],
  },
  {
    id: 'magenta',
    name: 'Magenta',
    color: '#FF2D55',
    gradientColors: ['#FF2D55', '#FF5577'],
  },
];

interface ColorRangeButtonProps {
  colorRange: ColorRangeDefinition;
  isActive: boolean;
  hasAdjustments: boolean;
  onPress: () => void;
}

const ColorRangeButton: React.FC<ColorRangeButtonProps> = ({
  colorRange,
  isActive,
  hasAdjustments,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.colorRangeButton,
        isActive && styles.colorRangeButtonActive,
      ]}
      onPress={onPress}>
      <LinearGradient
        colors={colorRange.gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.colorRangeGradient}>
        {hasAdjustments && (
          <View style={styles.adjustmentIndicator}>
            <Icon name="ellipse" size={8} color={colors.semantic.neutralWhite} />
          </View>
        )}
      </LinearGradient>
      <Text
        style={[
          styles.colorRangeName,
          isActive && styles.colorRangeNameActive,
        ]}>
        {colorRange.name}
      </Text>
    </TouchableOpacity>
  );
};

interface HSLSliderProps {
  label: string;
  icon: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
  onReset: () => void;
}

const HSLSlider: React.FC<HSLSliderProps> = ({
  label,
  icon,
  value,
  min,
  max,
  unit = '',
  onChange,
  onReset,
}) => {
  const isModified = value !== 0;

  return (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <View style={styles.sliderInfo}>
          <Icon name={icon} size={18} color={colors.text.secondary} />
          <Text style={styles.sliderLabel}>{label}</Text>
        </View>
        <View style={styles.sliderValue}>
          <Text
            style={[
              styles.valueText,
              isModified && styles.valueTextModified,
            ]}>
            {value > 0 && '+'}
            {value}
            {unit}
          </Text>
          {isModified && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={onReset}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="refresh" size={14} color={colors.accent.electricBlue} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={value}
        onValueChange={onChange}
        step={1}
        minimumTrackTintColor={colors.accent.electricBlue}
        maximumTrackTintColor={colors.primary.steelGray}
        thumbTintColor={colors.accent.electricBlue}
      />
    </View>
  );
};

export const HSLTool: React.FC = () => {
  const isPremium = useStore(state => state.isPremium);
  const [selectedRange, setSelectedRange] = useState<ColorRange>('red');
  const [adjustments, setAdjustments] = useState<Record<ColorRange, HSLAdjustment>>(
    colorRanges.reduce((acc, range) => ({
      ...acc,
      [range.id]: {hue: 0, saturation: 0, luminance: 0},
    }), {} as Record<ColorRange, HSLAdjustment>)
  );

  const handleAdjustmentChange = useCallback(
    (range: ColorRange, property: keyof HSLAdjustment, value: number) => {
      setAdjustments(prev => ({
        ...prev,
        [range]: {
          ...prev[range],
          [property]: value,
        },
      }));
    },
    []
  );

  const handleResetColor = useCallback(() => {
    setAdjustments(prev => ({
      ...prev,
      [selectedRange]: {hue: 0, saturation: 0, luminance: 0},
    }));
  }, [selectedRange]);

  const handleResetAll = useCallback(() => {
    setAdjustments(
      colorRanges.reduce((acc, range) => ({
        ...acc,
        [range.id]: {hue: 0, saturation: 0, luminance: 0},
      }), {} as Record<ColorRange, HSLAdjustment>)
    );
  }, []);

  const hasAnyAdjustments = Object.values(adjustments).some(
    adj => adj.hue !== 0 || adj.saturation !== 0 || adj.luminance !== 0
  );

  const hasCurrentRangeAdjustments =
    adjustments[selectedRange].hue !== 0 ||
    adjustments[selectedRange].saturation !== 0 ||
    adjustments[selectedRange].luminance !== 0;

  if (!isPremium) {
    return (
      <View style={styles.lockedContainer}>
        <Icon name="lock-closed" size={48} color={colors.accent.vividPurple} />
        <Text style={styles.lockedTitle}>HSL Tool is Premium</Text>
        <Text style={styles.lockedDescription}>
          Unlock selective color adjustments for precise control over 8 color ranges
        </Text>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentAdjustment = adjustments[selectedRange];

  return (
    <View style={styles.container}>
      {/* Color Range Selector */}
      <View style={styles.colorRangeSelector}>
        <View style={styles.colorRangeSelectorHeader}>
          <Text style={styles.sectionTitle}>Select Color Range</Text>
          {hasAnyAdjustments && (
            <TouchableOpacity
              style={styles.resetAllButton}
              onPress={handleResetAll}>
              <Icon name="refresh" size={16} color={colors.accent.electricBlue} />
              <Text style={styles.resetAllText}>Reset All</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.colorRangeList}>
          {colorRanges.map(range => {
            const hasAdj =
              adjustments[range.id].hue !== 0 ||
              adjustments[range.id].saturation !== 0 ||
              adjustments[range.id].luminance !== 0;

            return (
              <ColorRangeButton
                key={range.id}
                colorRange={range}
                isActive={selectedRange === range.id}
                hasAdjustments={hasAdj}
                onPress={() => setSelectedRange(range.id)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Color Preview Strip */}
      <View style={styles.colorPreviewContainer}>
        <LinearGradient
          colors={colorRanges.find(r => r.id === selectedRange)?.gradientColors || []}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.colorPreview}
        />
      </View>

      {/* HSL Adjustments */}
      <View style={styles.adjustmentsContainer}>
        <View style={styles.adjustmentsHeader}>
          <Text style={styles.sectionTitle}>
            {colorRanges.find(r => r.id === selectedRange)?.name} Adjustments
          </Text>
          {hasCurrentRangeAdjustments && (
            <TouchableOpacity
              style={styles.resetColorButton}
              onPress={handleResetColor}>
              <Icon name="refresh" size={16} color={colors.accent.electricBlue} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.slidersList}>
          <HSLSlider
            label="Hue"
            icon="color-palette"
            value={currentAdjustment.hue}
            min={-180}
            max={180}
            unit="°"
            onChange={value =>
              handleAdjustmentChange(selectedRange, 'hue', value)
            }
            onReset={() =>
              handleAdjustmentChange(selectedRange, 'hue', 0)
            }
          />

          <HSLSlider
            label="Saturation"
            icon="water"
            value={currentAdjustment.saturation}
            min={-100}
            max={100}
            onChange={value =>
              handleAdjustmentChange(selectedRange, 'saturation', value)
            }
            onReset={() =>
              handleAdjustmentChange(selectedRange, 'saturation', 0)
            }
          />

          <HSLSlider
            label="Luminance"
            icon="sunny"
            value={currentAdjustment.luminance}
            min={-100}
            max={100}
            onChange={value =>
              handleAdjustmentChange(selectedRange, 'luminance', value)
            }
            onReset={() =>
              handleAdjustmentChange(selectedRange, 'luminance', 0)
            }
          />
        </View>
      </View>

      {/* Hint */}
      <Text style={styles.hint}>
        Adjust individual colors without affecting the rest of your image
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  lockedTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  lockedDescription: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  upgradeButton: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.accent.vividPurple,
  },
  upgradeButtonText: {
    ...typography.bodyLarge,
    color: colors.semantic.neutralWhite,
    fontWeight: '700',
  },
  colorRangeSelector: {
    gap: spacing.sm,
  },
  colorRangeSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  resetAllText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  colorRangeList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  colorRangeButton: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  colorRangeButtonActive: {
    transform: [{scale: 1.05}],
  },
  colorRangeGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  adjustmentIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  colorRangeName: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.secondary,
  },
  colorRangeNameActive: {
    color: colors.text.primary,
    fontWeight: '700',
  },
  colorPreviewContainer: {
    marginHorizontal: spacing.md,
    height: 40,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
  },
  colorPreview: {
    flex: 1,
  },
  adjustmentsContainer: {
    flex: 1,
    gap: spacing.sm,
  },
  adjustmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  resetColorButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidersList: {
    gap: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sliderContainer: {
    gap: spacing.xs,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sliderLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  sliderValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  valueText: {
    ...typography.body,
    color: colors.text.tertiary,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
  valueTextModified: {
    color: colors.accent.electricBlue,
  },
  resetButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  hint: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
