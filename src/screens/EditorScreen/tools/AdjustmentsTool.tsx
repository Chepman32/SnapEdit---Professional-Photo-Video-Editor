/**
 * Adjustments Tool Component
 * 10 adjustment sliders with real-time preview
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius} from '@theme';
import {useStore} from '@/store';

interface AdjustmentDefinition {
  id: string;
  label: string;
  icon: string;
  min: number;
  max: number;
  default: number;
  step: number;
  unit: string;
}

const adjustments: AdjustmentDefinition[] = [
  {
    id: 'exposure',
    label: 'Exposure',
    icon: 'sunny',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'contrast',
    label: 'Contrast',
    icon: 'contrast',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'highlights',
    label: 'Highlights',
    icon: 'flashlight',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'shadows',
    label: 'Shadows',
    icon: 'moon',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'vibrance',
    label: 'Vibrance',
    icon: 'color-palette',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'saturation',
    label: 'Saturation',
    icon: 'water',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'warmth',
    label: 'Warmth',
    icon: 'flame',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'tint',
    label: 'Tint',
    icon: 'eyedrop',
    min: -100,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'sharpness',
    label: 'Sharpness',
    icon: 'diamond',
    min: 0,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
  {
    id: 'vignette',
    label: 'Vignette',
    icon: 'radio-button-off',
    min: 0,
    max: 100,
    default: 0,
    step: 1,
    unit: '',
  },
];

interface AdjustmentPreset {
  id: string;
  name: string;
  icon: string;
  values: Record<string, number>;
}

const presets: AdjustmentPreset[] = [
  {
    id: 'auto',
    name: 'Auto',
    icon: 'sparkles',
    values: {
      exposure: 10,
      contrast: 15,
      highlights: -10,
      shadows: 20,
      vibrance: 15,
      saturation: 10,
      warmth: 5,
      tint: 0,
      sharpness: 15,
      vignette: 0,
    },
  },
  {
    id: 'portrait',
    name: 'Portrait',
    icon: 'person',
    values: {
      exposure: 5,
      contrast: 10,
      highlights: -15,
      shadows: 15,
      vibrance: 10,
      saturation: 5,
      warmth: 10,
      tint: -5,
      sharpness: 20,
      vignette: 15,
    },
  },
  {
    id: 'landscape',
    name: 'Landscape',
    icon: 'image',
    values: {
      exposure: 0,
      contrast: 20,
      highlights: -20,
      shadows: 10,
      vibrance: 30,
      saturation: 20,
      warmth: 0,
      tint: 0,
      sharpness: 25,
      vignette: 5,
    },
  },
];

interface AdjustmentSliderProps {
  adjustment: AdjustmentDefinition;
  value: number;
  onChange: (value: number) => void;
  onReset: () => void;
}

const AdjustmentSlider: React.FC<AdjustmentSliderProps> = ({
  adjustment,
  value,
  onChange,
  onReset,
}) => {
  const isModified = value !== adjustment.default;

  return (
    <View style={styles.adjustmentRow}>
      <View style={styles.adjustmentHeader}>
        <View style={styles.adjustmentInfo}>
          <Icon name={adjustment.icon} size={20} color={colors.text.secondary} />
          <Text style={styles.adjustmentLabel}>{adjustment.label}</Text>
        </View>
        <View style={styles.adjustmentValue}>
          <Text
            style={[
              styles.valueText,
              isModified && styles.valueTextModified,
            ]}>
            {value > 0 && '+'}
            {value}
            {adjustment.unit}
          </Text>
          {isModified && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={onReset}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="refresh" size={16} color={colors.accent.electricBlue} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={adjustment.min}
        maximumValue={adjustment.max}
        value={value}
        onValueChange={onChange}
        step={adjustment.step}
        minimumTrackTintColor={colors.accent.electricBlue}
        maximumTrackTintColor={colors.primary.steelGray}
        thumbTintColor={colors.accent.electricBlue}
      />
    </View>
  );
};

interface PresetButtonProps {
  preset: AdjustmentPreset;
  onPress: () => void;
}

const PresetButton: React.FC<PresetButtonProps> = ({preset, onPress}) => {
  return (
    <TouchableOpacity style={styles.presetButton} onPress={onPress}>
      <Icon name={preset.icon} size={24} color={colors.accent.electricBlue} />
      <Text style={styles.presetName}>{preset.name}</Text>
    </TouchableOpacity>
  );
};

export const AdjustmentsTool: React.FC = () => {
  const adjustmentsState = useStore(state => state.adjustments);
  const setAdjustment = useStore(state => state.setAdjustment);
  const resetAdjustments = useStore(state => state.resetAdjustments);

  const [localAdjustments, setLocalAdjustments] = useState<Record<string, number>>(
    adjustmentsState || {}
  );

  const handleAdjustmentChange = useCallback(
    (id: string, value: number) => {
      const newAdjustments = {...localAdjustments, [id]: value};
      setLocalAdjustments(newAdjustments);
      setAdjustment(id, value);
    },
    [localAdjustments, setAdjustment]
  );

  const handleAdjustmentReset = useCallback(
    (id: string) => {
      const adjustment = adjustments.find(a => a.id === id);
      if (adjustment) {
        handleAdjustmentChange(id, adjustment.default);
      }
    },
    [handleAdjustmentChange]
  );

  const handleResetAll = useCallback(() => {
    const defaultValues: Record<string, number> = {};
    adjustments.forEach(adj => {
      defaultValues[adj.id] = adj.default;
    });
    setLocalAdjustments(defaultValues);
    resetAdjustments();
  }, [resetAdjustments]);

  const handlePresetApply = useCallback(
    (preset: AdjustmentPreset) => {
      setLocalAdjustments(preset.values);
      Object.entries(preset.values).forEach(([key, value]) => {
        setAdjustment(key, value);
      });
    },
    [setAdjustment]
  );

  const hasModifications = adjustments.some(
    adj => (localAdjustments[adj.id] ?? adj.default) !== adj.default
  );

  return (
    <View style={styles.container}>
      {/* Presets */}
      <View style={styles.presetsContainer}>
        <Text style={styles.sectionTitle}>Presets</Text>
        <View style={styles.presetsList}>
          {presets.map(preset => (
            <PresetButton
              key={preset.id}
              preset={preset}
              onPress={() => handlePresetApply(preset)}
            />
          ))}
        </View>
      </View>

      {/* Adjustments */}
      <View style={styles.adjustmentsHeader}>
        <Text style={styles.sectionTitle}>Adjustments</Text>
        {hasModifications && (
          <TouchableOpacity style={styles.resetAllButton} onPress={handleResetAll}>
            <Icon name="refresh" size={18} color={colors.accent.electricBlue} />
            <Text style={styles.resetAllText}>Reset All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.adjustmentsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.adjustmentsContent}>
        {adjustments.map(adjustment => (
          <AdjustmentSlider
            key={adjustment.id}
            adjustment={adjustment}
            value={localAdjustments[adjustment.id] ?? adjustment.default}
            onChange={value => handleAdjustmentChange(adjustment.id, value)}
            onReset={() => handleAdjustmentReset(adjustment.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
  },
  presetsContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  presetsList: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  presetButton: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
  },
  presetName: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  adjustmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  resetAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  resetAllText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  adjustmentsList: {
    flex: 1,
  },
  adjustmentsContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
  },
  adjustmentRow: {
    gap: spacing.sm,
  },
  adjustmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  adjustmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  adjustmentLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  adjustmentValue: {
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
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
