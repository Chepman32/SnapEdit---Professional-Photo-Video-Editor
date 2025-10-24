/**
 * Text Tool Component
 * Text editing with fonts, formatting, and styling
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius} from '@theme';
import {useStore} from '@/store';

type FontFamily =
  | 'System'
  | 'SF Pro'
  | 'Helvetica'
  | 'Times'
  | 'Courier'
  | 'Arial'
  | 'Georgia'
  | 'Impact';

type TextAlignment = 'left' | 'center' | 'right';

interface TextLayerData {
  id: string;
  text: string;
  fontFamily: FontFamily;
  fontSize: number;
  color: string;
  alignment: TextAlignment;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  hasBackground: boolean;
  backgroundColor: string;
  hasStroke: boolean;
  strokeColor: string;
  hasShadow: boolean;
  x: number;
  y: number;
  rotation: number;
}

const fonts: FontFamily[] = [
  'System',
  'SF Pro',
  'Helvetica',
  'Times',
  'Courier',
  'Arial',
  'Georgia',
  'Impact',
];

const colorPresets = [
  colors.semantic.neutralWhite,
  colors.semantic.neutralBlack,
  colors.accent.coralRed,
  colors.accent.electricBlue,
  colors.accent.emeraldGreen,
  colors.accent.vividPurple,
  '#FF9500', // Orange
  '#FFCC00', // Yellow
];

interface FontButtonProps {
  font: FontFamily;
  isActive: boolean;
  onPress: () => void;
}

const FontButton: React.FC<FontButtonProps> = ({font, isActive, onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.fontButton,
        isActive && styles.fontButtonActive,
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.fontSample,
          isActive && styles.fontSampleActive,
        ]}>
        {font}
      </Text>
    </TouchableOpacity>
  );
};

interface ColorSwatchProps {
  color: string;
  isSelected: boolean;
  onPress: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({color, isSelected, onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.colorSwatch,
        {backgroundColor: color},
        isSelected && styles.colorSwatchSelected,
      ]}
      onPress={onPress}>
      {isSelected && (
        <Icon
          name="checkmark"
          size={16}
          color={color === colors.semantic.neutralWhite ? colors.semantic.neutralBlack : colors.semantic.neutralWhite}
        />
      )}
    </TouchableOpacity>
  );
};

interface StyleToggleProps {
  icon: string;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

const StyleToggle: React.FC<StyleToggleProps> = ({
  icon,
  label,
  isActive,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.styleToggle,
        isActive && styles.styleToggleActive,
      ]}
      onPress={onPress}>
      <Icon
        name={icon}
        size={20}
        color={isActive ? colors.accent.electricBlue : colors.text.secondary}
      />
      <Text
        style={[
          styles.styleToggleLabel,
          isActive && styles.styleToggleLabelActive,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const TextTool: React.FC = () => {
  const [textLayers, setTextLayers] = useState<TextLayerData[]>([]);
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [fontFamily, setFontFamily] = useState<FontFamily>('SF Pro');
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState(colors.semantic.neutralWhite);
  const [alignment, setAlignment] = useState<TextAlignment>('center');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [hasBackground, setHasBackground] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(colors.semantic.neutralBlack);
  const [hasStroke, setHasStroke] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleAddText = useCallback(() => {
    if (!currentText.trim()) return;

    const newLayer: TextLayerData = {
      id: Date.now().toString(),
      text: currentText,
      fontFamily,
      fontSize,
      color: textColor,
      alignment,
      bold,
      italic,
      underline,
      hasBackground,
      backgroundColor,
      hasStroke,
      strokeColor: colors.semantic.neutralBlack,
      hasShadow,
      x: 50,
      y: 50,
      rotation: 0,
    };

    setTextLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
    setCurrentText('');
  }, [
    currentText,
    fontFamily,
    fontSize,
    textColor,
    alignment,
    bold,
    italic,
    underline,
    hasBackground,
    backgroundColor,
    hasStroke,
    hasShadow,
  ]);

  const handleDeleteLayer = useCallback((layerId: string) => {
    setTextLayers(prev => prev.filter(layer => layer.id !== layerId));
    if (activeLayerId === layerId) {
      setActiveLayerId(null);
    }
  }, [activeLayerId]);

  const alignmentIcons: Record<TextAlignment, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <View style={styles.container}>
      {/* Text Input */}
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter text..."
          placeholderTextColor={colors.text.tertiary}
          value={currentText}
          onChangeText={setCurrentText}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={[
            styles.addTextButton,
            !currentText.trim() && styles.addTextButtonDisabled,
          ]}
          onPress={handleAddText}
          disabled={!currentText.trim()}>
          <Icon name="add" size={24} color={colors.semantic.neutralWhite} />
        </TouchableOpacity>
      </View>

      {/* Font Selection */}
      <View style={styles.fontSelector}>
        <Text style={styles.sectionTitle}>Font</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.fontList}>
          {fonts.map(font => (
            <FontButton
              key={font}
              font={font}
              isActive={fontFamily === font}
              onPress={() => setFontFamily(font)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Font Size */}
      <View style={styles.sizeContainer}>
        <View style={styles.sizeHeader}>
          <Icon name="text" size={18} color={colors.text.secondary} />
          <Text style={styles.sectionTitle}>Size</Text>
        </View>
        <View style={styles.sizeControl}>
          <Text style={styles.sizeValue}>{fontSize}pt</Text>
          <Slider
            style={styles.sizeSlider}
            minimumValue={12}
            maximumValue={120}
            value={fontSize}
            onValueChange={setFontSize}
            step={1}
            minimumTrackTintColor={colors.accent.electricBlue}
            maximumTrackTintColor={colors.primary.steelGray}
            thumbTintColor={colors.accent.electricBlue}
          />
        </View>
      </View>

      {/* Alignment */}
      <View style={styles.alignmentContainer}>
        <Text style={styles.sectionTitle}>Alignment</Text>
        <View style={styles.alignmentButtons}>
          {(['left', 'center', 'right'] as TextAlignment[]).map(align => (
            <TouchableOpacity
              key={align}
              style={[
                styles.alignmentButton,
                alignment === align && styles.alignmentButtonActive,
              ]}
              onPress={() => setAlignment(align)}>
              <Icon
                name={alignmentIcons[align]}
                size={24}
                color={
                  alignment === align
                    ? colors.accent.electricBlue
                    : colors.text.secondary
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Style Toggles */}
      <View style={styles.styleToggles}>
        <StyleToggle
          icon="text"
          label="Bold"
          isActive={bold}
          onPress={() => setBold(!bold)}
        />
        <StyleToggle
          icon="text"
          label="Italic"
          isActive={italic}
          onPress={() => setItalic(!italic)}
        />
        <StyleToggle
          icon="text"
          label="Underline"
          isActive={underline}
          onPress={() => setUnderline(!underline)}
        />
      </View>

      {/* Color Picker */}
      <TouchableOpacity
        style={styles.colorPickerToggle}
        onPress={() => setShowColorPicker(!showColorPicker)}>
        <View style={styles.colorPickerInfo}>
          <View style={[styles.currentColor, {backgroundColor: textColor}]} />
          <Text style={styles.sectionTitle}>Text Color</Text>
        </View>
        <Icon
          name={showColorPicker ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {showColorPicker && (
        <View style={styles.colorSwatches}>
          {colorPresets.map(color => (
            <ColorSwatch
              key={color}
              color={color}
              isSelected={textColor === color}
              onPress={() => setTextColor(color)}
            />
          ))}
        </View>
      )}

      {/* Effects */}
      <View style={styles.effectsContainer}>
        <Text style={styles.sectionTitle}>Effects</Text>
        <View style={styles.effectsList}>
          <TouchableOpacity
            style={[
              styles.effectToggle,
              hasBackground && styles.effectToggleActive,
            ]}
            onPress={() => setHasBackground(!hasBackground)}>
            <Icon
              name="square"
              size={20}
              color={hasBackground ? colors.accent.electricBlue : colors.text.secondary}
            />
            <Text style={styles.effectLabel}>Background</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.effectToggle,
              hasStroke && styles.effectToggleActive,
            ]}
            onPress={() => setHasStroke(!hasStroke)}>
            <Icon
              name="ellipse-outline"
              size={20}
              color={hasStroke ? colors.accent.electricBlue : colors.text.secondary}
            />
            <Text style={styles.effectLabel}>Outline</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.effectToggle,
              hasShadow && styles.effectToggleActive,
            ]}
            onPress={() => setHasShadow(!hasShadow)}>
            <Icon
              name="layers"
              size={20}
              color={hasShadow ? colors.accent.electricBlue : colors.text.secondary}
            />
            <Text style={styles.effectLabel}>Shadow</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Text Layers */}
      {textLayers.length > 0 && (
        <View style={styles.layersContainer}>
          <Text style={styles.sectionTitle}>Text Layers ({textLayers.length})</Text>
          <View style={styles.layersList}>
            {textLayers.map(layer => (
              <View
                key={layer.id}
                style={[
                  styles.layerItem,
                  activeLayerId === layer.id && styles.layerItemActive,
                ]}>
                <TouchableOpacity
                  style={styles.layerInfo}
                  onPress={() => setActiveLayerId(layer.id)}>
                  <Icon name="text" size={16} color={colors.text.secondary} />
                  <Text style={styles.layerText} numberOfLines={1}>
                    {layer.text}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.layerDelete}
                  onPress={() => handleDeleteLayer(layer.id)}>
                  <Icon name="trash" size={18} color={colors.accent.coralRed} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Hint */}
      <Text style={styles.hint}>
        Add text • Tap on canvas to position • Pinch to scale
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
  },
  textInputContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  textInput: {
    flex: 1,
    minHeight: 80,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.card,
    backgroundColor: colors.primary.carbonGray,
    color: colors.text.primary,
    ...typography.bodyLarge,
    textAlignVertical: 'top',
  },
  addTextButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent.electricBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTextButtonDisabled: {
    opacity: 0.5,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  fontSelector: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  fontList: {
    gap: spacing.sm,
  },
  fontButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
    minWidth: 80,
  },
  fontButtonActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  fontSample: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  fontSampleActive: {
    color: colors.accent.electricBlue,
    fontWeight: '700',
  },
  sizeContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sizeValue: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
    minWidth: 50,
  },
  sizeSlider: {
    flex: 1,
    height: 40,
  },
  alignmentContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  alignmentButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  alignmentButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
  },
  alignmentButtonActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  styleToggles: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  styleToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  styleToggleActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  styleToggleLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  styleToggleLabelActive: {
    color: colors.accent.electricBlue,
  },
  colorPickerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  colorPickerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currentColor: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border.default,
  },
  colorSwatches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderColor: colors.accent.electricBlue,
  },
  effectsContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  effectsList: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  effectToggle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  effectToggleActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  effectLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  layersContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  layersList: {
    gap: spacing.sm,
  },
  layerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
  },
  layerItemActive: {
    backgroundColor: colors.accent.electricBlue + '20',
    borderWidth: 1,
    borderColor: colors.accent.electricBlue,
  },
  layerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  layerText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  layerDelete: {
    padding: spacing.xs,
  },
  hint: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
});
