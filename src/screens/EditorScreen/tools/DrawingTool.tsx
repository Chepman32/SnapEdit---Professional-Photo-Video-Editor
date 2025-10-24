/**
 * Drawing Tool Component
 * Skia-based drawing with multiple brush types and layers
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
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius} from '@theme';
import {useStore} from '@/store';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type BrushType = 'pen' | 'brush' | 'marker' | 'eraser' | 'blur';

interface BrushDefinition {
  id: BrushType;
  name: string;
  icon: string;
}

const brushes: BrushDefinition[] = [
  {id: 'pen', name: 'Pen', icon: 'create'},
  {id: 'brush', name: 'Brush', icon: 'brush'},
  {id: 'marker', name: 'Marker', icon: 'color-wand'},
  {id: 'eraser', name: 'Eraser', icon: 'remove-circle'},
  {id: 'blur', name: 'Blur', icon: 'radio-button-off'},
];

const colorPresets = [
  colors.semantic.neutralBlack,
  colors.semantic.neutralWhite,
  colors.accent.coralRed,
  colors.accent.electricBlue,
  colors.accent.emeraldGreen,
  colors.accent.vividPurple,
  '#FF9500', // Orange
  '#FFCC00', // Yellow
  '#FF2D55', // Pink
  '#5AC8FA', // Cyan
];

interface BrushButtonProps {
  brush: BrushDefinition;
  isActive: boolean;
  onPress: () => void;
}

const BrushButton: React.FC<BrushButtonProps> = ({brush, isActive, onPress}) => {
  return (
    <TouchableOpacity
      style={[
        styles.brushButton,
        isActive && styles.brushButtonActive,
      ]}
      onPress={onPress}>
      <Icon
        name={brush.icon}
        size={24}
        color={isActive ? colors.accent.electricBlue : colors.text.secondary}
      />
      <Text
        style={[
          styles.brushName,
          isActive && styles.brushNameActive,
        ]}>
        {brush.name}
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
          size={20}
          color={color === colors.semantic.neutralWhite ? colors.semantic.neutralBlack : colors.semantic.neutralWhite}
        />
      )}
    </TouchableOpacity>
  );
};

interface DrawingLayer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
}

interface LayerItemProps {
  layer: DrawingLayer;
  isActive: boolean;
  onPress: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

const LayerItem: React.FC<LayerItemProps> = ({
  layer,
  isActive,
  onPress,
  onToggleVisibility,
  onDelete,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.layerItem,
        isActive && styles.layerItemActive,
      ]}
      onPress={onPress}>
      <View style={styles.layerInfo}>
        <Icon name="layers" size={20} color={colors.text.secondary} />
        <Text style={styles.layerName}>{layer.name}</Text>
      </View>

      <View style={styles.layerActions}>
        <TouchableOpacity
          style={styles.layerAction}
          onPress={onToggleVisibility}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon
            name={layer.visible ? 'eye' : 'eye-off'}
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.layerAction}
          onPress={onDelete}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <Icon name="trash" size={20} color={colors.accent.coralRed} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export const DrawingTool: React.FC = () => {
  const [selectedBrush, setSelectedBrush] = useState<BrushType>('brush');
  const [selectedColor, setSelectedColor] = useState(colors.accent.electricBlue);
  const [brushSize, setBrushSize] = useState(10);
  const [opacity, setOpacity] = useState(100);
  const [layers, setLayers] = useState<DrawingLayer[]>([
    {id: '1', name: 'Layer 1', visible: true, opacity: 100},
  ]);
  const [activeLayerId, setActiveLayerId] = useState('1');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showLayers, setShowLayers] = useState(false);

  const handleAddLayer = useCallback(() => {
    const newLayer: DrawingLayer = {
      id: Date.now().toString(),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 100,
    };
    setLayers(prev => [...prev, newLayer]);
    setActiveLayerId(newLayer.id);
  }, [layers]);

  const handleToggleLayerVisibility = useCallback((layerId: string) => {
    setLayers(prev =>
      prev.map(layer =>
        layer.id === layerId
          ? {...layer, visible: !layer.visible}
          : layer
      )
    );
  }, []);

  const handleDeleteLayer = useCallback((layerId: string) => {
    if (layers.length === 1) return; // Keep at least one layer

    setLayers(prev => prev.filter(layer => layer.id !== layerId));

    if (activeLayerId === layerId) {
      setActiveLayerId(layers[0].id);
    }
  }, [layers, activeLayerId]);

  const handleClearLayer = useCallback(() => {
    // Clear the active layer
    console.log('Clear layer:', activeLayerId);
  }, [activeLayerId]);

  return (
    <View style={styles.container}>
      {/* Drawing Canvas Placeholder */}
      <View style={styles.canvasPlaceholder}>
        <Icon name="brush" size={48} color={colors.text.tertiary} />
        <Text style={styles.canvasHint}>Draw on the canvas above</Text>
      </View>

      {/* Brush Type Selector */}
      <View style={styles.brushSelector}>
        <Text style={styles.sectionTitle}>Brush Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.brushList}>
          {brushes.map(brush => (
            <BrushButton
              key={brush.id}
              brush={brush}
              isActive={selectedBrush === brush.id}
              onPress={() => setSelectedBrush(brush.id)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Color Picker Toggle */}
      <TouchableOpacity
        style={styles.colorPickerToggle}
        onPress={() => setShowColorPicker(!showColorPicker)}>
        <View style={styles.colorPickerInfo}>
          <View style={[styles.currentColor, {backgroundColor: selectedColor}]} />
          <Text style={styles.sectionTitle}>Color</Text>
        </View>
        <Icon
          name={showColorPicker ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {/* Color Swatches */}
      {showColorPicker && (
        <View style={styles.colorSwatches}>
          {colorPresets.map(color => (
            <ColorSwatch
              key={color}
              color={color}
              isSelected={selectedColor === color}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      )}

      {/* Brush Settings */}
      <View style={styles.settingsContainer}>
        {/* Brush Size */}
        <View style={styles.settingRow}>
          <View style={styles.settingHeader}>
            <Icon name="resize" size={18} color={colors.text.secondary} />
            <Text style={styles.settingLabel}>Size</Text>
          </View>
          <View style={styles.settingControl}>
            <Text style={styles.settingValue}>{brushSize}px</Text>
            <Slider
              style={styles.settingSlider}
              minimumValue={1}
              maximumValue={50}
              value={brushSize}
              onValueChange={setBrushSize}
              step={1}
              minimumTrackTintColor={colors.accent.electricBlue}
              maximumTrackTintColor={colors.primary.steelGray}
              thumbTintColor={colors.accent.electricBlue}
            />
          </View>
        </View>

        {/* Opacity */}
        <View style={styles.settingRow}>
          <View style={styles.settingHeader}>
            <Icon name="water" size={18} color={colors.text.secondary} />
            <Text style={styles.settingLabel}>Opacity</Text>
          </View>
          <View style={styles.settingControl}>
            <Text style={styles.settingValue}>{opacity}%</Text>
            <Slider
              style={styles.settingSlider}
              minimumValue={0}
              maximumValue={100}
              value={opacity}
              onValueChange={setOpacity}
              step={1}
              minimumTrackTintColor={colors.accent.electricBlue}
              maximumTrackTintColor={colors.primary.steelGray}
              thumbTintColor={colors.accent.electricBlue}
            />
          </View>
        </View>
      </View>

      {/* Layers Toggle */}
      <TouchableOpacity
        style={styles.layersToggle}
        onPress={() => setShowLayers(!showLayers)}>
        <View style={styles.layersInfo}>
          <Icon name="layers" size={20} color={colors.text.secondary} />
          <Text style={styles.sectionTitle}>Layers ({layers.length})</Text>
        </View>
        <Icon
          name={showLayers ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.text.secondary}
        />
      </TouchableOpacity>

      {/* Layers List */}
      {showLayers && (
        <View style={styles.layersContainer}>
          <View style={styles.layersList}>
            {layers.map(layer => (
              <LayerItem
                key={layer.id}
                layer={layer}
                isActive={activeLayerId === layer.id}
                onPress={() => setActiveLayerId(layer.id)}
                onToggleVisibility={() => handleToggleLayerVisibility(layer.id)}
                onDelete={() => handleDeleteLayer(layer.id)}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.addLayerButton}
            onPress={handleAddLayer}>
            <Icon name="add" size={20} color={colors.accent.electricBlue} />
            <Text style={styles.addLayerText}>Add Layer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={handleClearLayer}>
          <Icon name="trash" size={20} color={colors.accent.coralRed} />
          <Text style={styles.quickActionText}>Clear Layer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.md,
  },
  canvasPlaceholder: {
    alignSelf: 'center',
    width: SCREEN_WIDTH - spacing.screenPadding * 2,
    height: 120,
    borderRadius: borderRadius.card,
    backgroundColor: colors.primary.carbonGray,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  canvasHint: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  sectionTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  brushSelector: {
    gap: spacing.sm,
  },
  brushList: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  brushButton: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
    minWidth: 70,
  },
  brushButtonActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  brushName: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  brushNameActive: {
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorSwatchSelected: {
    borderColor: colors.accent.electricBlue,
  },
  settingsContainer: {
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  settingRow: {
    gap: spacing.sm,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  settingControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  settingValue: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
    minWidth: 50,
  },
  settingSlider: {
    flex: 1,
    height: 40,
  },
  layersToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  layersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  layerName: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '500',
  },
  layerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  layerAction: {
    padding: spacing.xs,
  },
  addLayerButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
    borderWidth: 1,
    borderColor: colors.accent.electricBlue,
    borderStyle: 'dashed',
  },
  addLayerText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  quickActions: {
    paddingHorizontal: spacing.md,
  },
  quickActionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  quickActionText: {
    ...typography.body,
    color: colors.accent.coralRed,
    fontWeight: '600',
  },
});
