/**
 * Editor Screen - Complete Implementation
 * Phase 10: Canvas and core structure with Skia
 */

import React, {useState, useCallback, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {
  Canvas,
  Image as SkiaImage,
  useImage,
  Skia,
  ColorMatrix,
  Paint,
} from '@shopify/react-native-skia';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';
import {FiltersTool} from './tools/FiltersTool';
import {AdjustmentsTool} from './tools/AdjustmentsTool';
import {CurvesTool} from './tools/CurvesTool';
import {HSLTool} from './tools/HSLTool';
import {CropTool} from './tools/CropTool';
import {DrawingTool} from './tools/DrawingTool';
import {TextTool} from './tools/TextTool';
import {ExportTool} from './tools/ExportTool';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
const CANVAS_HEIGHT = SCREEN_HEIGHT * 0.6;

type EditorTool =
  | 'filters'
  | 'adjust'
  | 'curves'
  | 'hsl'
  | 'crop'
  | 'draw'
  | 'text'
  | 'export';

interface EditorParams {
  imageUri: string;
  fromGallery?: boolean;
}

type EditorScreenRouteProp = RouteProp<{Editor: EditorParams}, 'Editor'>;

const tools: Array<{id: EditorTool; icon: string; label: string; premium?: boolean}> = [
  {id: 'filters', icon: 'color-filter', label: 'Filters'},
  {id: 'adjust', icon: 'options', label: 'Adjust'},
  {id: 'curves', icon: 'analytics', label: 'Curves', premium: true},
  {id: 'hsl', icon: 'color-palette', label: 'HSL', premium: true},
  {id: 'crop', icon: 'crop', label: 'Crop'},
  {id: 'draw', icon: 'brush', label: 'Draw'},
  {id: 'text', icon: 'text', label: 'Text'},
  {id: 'export', icon: 'download', label: 'Export'},
];

interface ToolButtonProps {
  tool: (typeof tools)[0];
  isActive: boolean;
  onPress: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({tool, isActive, onPress}) => {
  const isPremium = useStore(state => state.isPremium);
  const isLocked = tool.premium && !isPremium;

  return (
    <TouchableOpacity
      style={[styles.toolButton, isActive && styles.toolButtonActive]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.7}>
      <View style={styles.toolIconContainer}>
        <Icon
          name={tool.icon}
          size={24}
          color={isActive ? colors.accent.electricBlue : colors.text.secondary}
        />
        {isLocked && (
          <View style={styles.lockBadge}>
            <Icon name="lock-closed" size={12} color={colors.semantic.neutralWhite} />
          </View>
        )}
      </View>
      <Text
        style={[
          styles.toolLabel,
          isActive && styles.toolLabelActive,
          isLocked && styles.toolLabelLocked,
        ]}>
        {tool.label}
      </Text>
    </TouchableOpacity>
  );
};

export const EditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EditorScreenRouteProp>();
  const {imageUri} = route.params;

  // State management
  const [activeTool, setActiveTool] = useState<EditorTool | null>(null);
  const [showHistogram, setShowHistogram] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  // Zustand store
  const canUndo = useStore(state => state.canUndo);
  const canRedo = useStore(state => state.canRedo);
  const undo = useStore(state => state.undo);
  const redo = useStore(state => state.redo);
  const setImageUri = useStore(state => state.setImageUri);

  // Gesture values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  // Load image
  const skiaImage = useImage(imageUri);

  useEffect(() => {
    setImageUri(imageUri);
  }, [imageUri, setImageUri]);

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  // Pan gesture for moving
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Rotation gesture
  const rotationGesture = Gesture.Rotation()
    .onUpdate(event => {
      rotation.value = event.rotation;
    })
    .onEnd(() => {
      rotation.value = 0;
    });

  // Compose gestures
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    rotationGesture
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scale.value},
      {rotate: `${rotation.value}rad`},
    ],
  }));

  const handleToolSelect = useCallback((toolId: EditorTool) => {
    setActiveTool(current => (current === toolId ? null : toolId));
  }, []);

  const handleUndo = useCallback(() => {
    if (canUndo()) {
      undo();
    }
  }, [canUndo, undo]);

  const handleRedo = useCallback(() => {
    if (canRedo()) {
      redo();
    }
  }, [canRedo, redo]);

  const handleReset = useCallback(() => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotation.value = withSpring(0);
    savedScale.value = 1;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  }, [scale, translateX, translateY, rotation, savedScale, savedTranslateX, savedTranslateY]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleClose} style={styles.topButton}>
            <Icon name="close" size={28} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.topControls}>
            <TouchableOpacity
              onPress={handleUndo}
              disabled={!canUndo()}
              style={[styles.topButton, !canUndo() && styles.topButtonDisabled]}>
              <Icon
                name="arrow-undo"
                size={24}
                color={canUndo() ? colors.text.primary : colors.text.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRedo}
              disabled={!canRedo()}
              style={[styles.topButton, !canRedo() && styles.topButtonDisabled]}>
              <Icon
                name="arrow-redo"
                size={24}
                color={canRedo() ? colors.text.primary : colors.text.tertiary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReset}
              style={styles.topButton}>
              <Icon name="refresh" size={24} color={colors.text.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCompareMode(!compareMode)}
              style={[styles.topButton, compareMode && styles.topButtonActive]}>
              <Icon
                name="git-compare"
                size={24}
                color={compareMode ? colors.accent.electricBlue : colors.text.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowHistogram(!showHistogram)}
              style={[styles.topButton, showHistogram && styles.topButtonActive]}>
              <Icon
                name="bar-chart"
                size={24}
                color={showHistogram ? colors.accent.electricBlue : colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.topButton}>
            <Icon name="checkmark" size={28} color={colors.accent.emeraldGreen} />
          </TouchableOpacity>
        </View>

        {/* Canvas Area */}
        <View style={styles.canvasContainer}>
          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[styles.canvas, animatedStyle]}>
              <Canvas style={styles.skiaCanvas}>
                {skiaImage && (
                  <SkiaImage
                    image={skiaImage}
                    x={0}
                    y={0}
                    width={SCREEN_WIDTH}
                    height={CANVAS_HEIGHT}
                    fit="contain"
                  />
                )}
              </Canvas>
            </Animated.View>
          </GestureDetector>

          {/* Histogram Overlay */}
          {showHistogram && (
            <View style={styles.histogramOverlay}>
              <View style={styles.histogramContainer}>
                <Text style={styles.histogramLabel}>RGB Histogram</Text>
                <View style={styles.histogramPlaceholder}>
                  <Icon name="bar-chart" size={48} color={colors.text.tertiary} />
                  <Text style={styles.histogramText}>Histogram will render here</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Tool Bar */}
        <View style={styles.toolBar}>
          <View style={styles.toolBarContent}>
            {tools.map(tool => (
              <ToolButton
                key={tool.id}
                tool={tool}
                isActive={activeTool === tool.id}
                onPress={() => handleToolSelect(tool.id)}
              />
            ))}
          </View>
        </View>

        {/* Tool Panel (conditionally rendered based on active tool) */}
        {activeTool && (
          <View style={styles.toolPanel}>
            <LinearGradient
              colors={[colors.primary.carbonGray, colors.primary.obsidianBlack]}
              style={styles.toolPanelGradient}>
              <View style={styles.toolPanelHeader}>
                <Text style={styles.toolPanelTitle}>
                  {tools.find(t => t.id === activeTool)?.label}
                </Text>
                <TouchableOpacity onPress={() => setActiveTool(null)}>
                  <Icon name="chevron-down" size={24} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.toolPanelContent}>
                {activeTool === 'filters' && (
                  <FiltersTool imageUri={imageUri} />
                )}
                {activeTool === 'adjust' && (
                  <AdjustmentsTool />
                )}
                {activeTool === 'curves' && (
                  <CurvesTool />
                )}
                {activeTool === 'hsl' && (
                  <HSLTool />
                )}
                {activeTool === 'crop' && (
                  <CropTool />
                )}
                {activeTool === 'draw' && (
                  <DrawingTool />
                )}
                {activeTool === 'text' && (
                  <TextTool />
                )}
                {activeTool === 'export' && (
                  <ExportTool />
                )}
              </View>
            </LinearGradient>
          </View>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  topButtonActive: {
    backgroundColor: colors.overlay.light,
  },
  topButtonDisabled: {
    opacity: 0.3,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: colors.primary.carbonGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    width: SCREEN_WIDTH,
    height: CANVAS_HEIGHT,
  },
  skiaCanvas: {
    width: SCREEN_WIDTH,
    height: CANVAS_HEIGHT,
  },
  histogramOverlay: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 200,
    backgroundColor: colors.primary.carbonGray + 'DD',
    borderRadius: borderRadius.card,
    padding: spacing.md,
    ...shadows.medium,
  },
  histogramContainer: {
    gap: spacing.sm,
  },
  histogramLabel: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  histogramPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  histogramText: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  toolBar: {
    backgroundColor: colors.primary.carbonGray,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.default,
    paddingVertical: spacing.sm,
  },
  toolBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  toolButton: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: spacing.xs,
    borderRadius: borderRadius.small,
    minWidth: 60,
  },
  toolButtonActive: {
    backgroundColor: colors.overlay.light,
  },
  toolIconContainer: {
    position: 'relative',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent.vividPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  toolLabelActive: {
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  toolLabelLocked: {
    opacity: 0.5,
  },
  toolPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
    overflow: 'hidden',
    ...shadows.strong,
  },
  toolPanelGradient: {
    flex: 1,
    padding: spacing.lg,
  },
  toolPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  toolPanelTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  toolPanelContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolPanelPlaceholder: {
    ...typography.body,
    color: colors.text.tertiary,
  },
});
