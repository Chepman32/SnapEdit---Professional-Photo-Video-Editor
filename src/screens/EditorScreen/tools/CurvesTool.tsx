/**
 * Curves Tool Component (Premium)
 * RGB curves with interactive control points
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Canvas, Path, Circle, Line, Skia} from '@shopify/react-native-skia';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius} from '@theme';
import {useStore} from '@/store';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const CURVE_SIZE = SCREEN_WIDTH - spacing.screenPadding * 2;
const GRID_DIVISIONS = 4;

type CurveChannel = 'rgb' | 'red' | 'green' | 'blue';

interface ControlPoint {
  id: string;
  x: number;
  y: number;
}

interface CurvePreset {
  id: string;
  name: string;
  icon: string;
  points: ControlPoint[];
}

const presets: CurvePreset[] = [
  {
    id: 'linear',
    name: 'Linear',
    icon: 'remove',
    points: [
      {id: '1', x: 0, y: CURVE_SIZE},
      {id: '2', x: CURVE_SIZE, y: 0},
    ],
  },
  {
    id: 's_curve',
    name: 'S-Curve',
    icon: 'git-branch',
    points: [
      {id: '1', x: 0, y: CURVE_SIZE},
      {id: '2', x: CURVE_SIZE * 0.33, y: CURVE_SIZE * 0.75},
      {id: '3', x: CURVE_SIZE * 0.67, y: CURVE_SIZE * 0.25},
      {id: '4', x: CURVE_SIZE, y: 0},
    ],
  },
  {
    id: 'fade',
    name: 'Fade',
    icon: 'sunny',
    points: [
      {id: '1', x: 0, y: CURVE_SIZE * 0.8},
      {id: '2', x: CURVE_SIZE, y: 0},
    ],
  },
  {
    id: 'high_key',
    name: 'High Key',
    icon: 'flashlight',
    points: [
      {id: '1', x: 0, y: CURVE_SIZE},
      {id: '2', x: CURVE_SIZE * 0.5, y: CURVE_SIZE * 0.2},
      {id: '3', x: CURVE_SIZE, y: 0},
    ],
  },
  {
    id: 'low_key',
    name: 'Low Key',
    icon: 'moon',
    points: [
      {id: '1', x: 0, y: CURVE_SIZE},
      {id: '2', x: CURVE_SIZE * 0.5, y: CURVE_SIZE * 0.8},
      {id: '3', x: CURVE_SIZE, y: 0},
    ],
  },
];

interface ChannelButtonProps {
  channel: CurveChannel;
  isActive: boolean;
  onPress: () => void;
}

const ChannelButton: React.FC<ChannelButtonProps> = ({
  channel,
  isActive,
  onPress,
}) => {
  const getChannelColor = () => {
    switch (channel) {
      case 'rgb':
        return colors.semantic.neutralWhite;
      case 'red':
        return colors.accent.coralRed;
      case 'green':
        return colors.accent.emeraldGreen;
      case 'blue':
        return colors.accent.electricBlue;
    }
  };

  const getChannelLabel = () => {
    switch (channel) {
      case 'rgb':
        return 'RGB';
      case 'red':
        return 'R';
      case 'green':
        return 'G';
      case 'blue':
        return 'B';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.channelButton,
        isActive && styles.channelButtonActive,
        isActive && {borderColor: getChannelColor()},
      ]}
      onPress={onPress}>
      <Text
        style={[
          styles.channelLabel,
          isActive && {color: getChannelColor()},
        ]}>
        {getChannelLabel()}
      </Text>
    </TouchableOpacity>
  );
};

interface PresetButtonProps {
  preset: CurvePreset;
  onPress: () => void;
}

const PresetButton: React.FC<PresetButtonProps> = ({preset, onPress}) => {
  return (
    <TouchableOpacity style={styles.presetButton} onPress={onPress}>
      <Icon name={preset.icon} size={20} color={colors.text.secondary} />
      <Text style={styles.presetLabel}>{preset.name}</Text>
    </TouchableOpacity>
  );
};

export const CurvesTool: React.FC = () => {
  const isPremium = useStore(state => state.isPremium);
  const [activeChannel, setActiveChannel] = useState<CurveChannel>('rgb');
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([
    {id: '1', x: 0, y: CURVE_SIZE},
    {id: '2', x: CURVE_SIZE, y: 0},
  ]);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  const handleAddPoint = useCallback(
    (x: number, y: number) => {
      if (!isPremium) return;

      const newPoint: ControlPoint = {
        id: Date.now().toString(),
        x: Math.max(0, Math.min(CURVE_SIZE, x)),
        y: Math.max(0, Math.min(CURVE_SIZE, y)),
      };

      const sortedPoints = [...controlPoints, newPoint].sort((a, b) => a.x - b.x);
      setControlPoints(sortedPoints);
    },
    [controlPoints, isPremium]
  );

  const handleMovePoint = useCallback(
    (pointId: string, x: number, y: number) => {
      if (!isPremium) return;

      setControlPoints(prevPoints =>
        prevPoints.map(point =>
          point.id === pointId
            ? {
                ...point,
                x: Math.max(0, Math.min(CURVE_SIZE, x)),
                y: Math.max(0, Math.min(CURVE_SIZE, y)),
              }
            : point
        ).sort((a, b) => a.x - b.x)
      );
    },
    [isPremium]
  );

  const handleRemovePoint = useCallback(
    (pointId: string) => {
      if (!isPremium) return;
      if (controlPoints.length <= 2) return; // Keep at least 2 points

      setControlPoints(prevPoints =>
        prevPoints.filter(point => point.id !== pointId)
      );
    },
    [controlPoints, isPremium]
  );

  const handlePresetApply = useCallback(
    (preset: CurvePreset) => {
      if (!isPremium) return;
      setControlPoints(preset.points);
    },
    [isPremium]
  );

  const handleReset = useCallback(() => {
    setControlPoints([
      {id: '1', x: 0, y: CURVE_SIZE},
      {id: '2', x: CURVE_SIZE, y: 0},
    ]);
  }, []);

  // Create curve path from control points
  const createCurvePath = () => {
    const path = Skia.Path.Make();

    if (controlPoints.length === 0) return path;

    path.moveTo(controlPoints[0].x, controlPoints[0].y);

    for (let i = 0; i < controlPoints.length - 1; i++) {
      const current = controlPoints[i];
      const next = controlPoints[i + 1];

      // Use quadratic bezier for smooth curves
      const controlX = (current.x + next.x) / 2;
      const controlY = (current.y + next.y) / 2;

      path.quadTo(current.x, current.y, controlX, controlY);
    }

    // Final line to last point
    const lastPoint = controlPoints[controlPoints.length - 1];
    path.lineTo(lastPoint.x, lastPoint.y);

    return path;
  };

  if (!isPremium) {
    return (
      <View style={styles.lockedContainer}>
        <Icon name="lock-closed" size={48} color={colors.accent.vividPurple} />
        <Text style={styles.lockedTitle}>Curves Tool is Premium</Text>
        <Text style={styles.lockedDescription}>
          Unlock precise tone curve adjustments with RGB channels
        </Text>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Channel Selector */}
      <View style={styles.channelSelector}>
        {(['rgb', 'red', 'green', 'blue'] as CurveChannel[]).map(channel => (
          <ChannelButton
            key={channel}
            channel={channel}
            isActive={activeChannel === channel}
            onPress={() => setActiveChannel(channel)}
          />
        ))}
      </View>

      {/* Curve Canvas */}
      <View style={styles.curveContainer}>
        <GestureHandlerRootView>
          <Canvas style={styles.canvas}>
            {/* Grid lines */}
            {Array.from({length: GRID_DIVISIONS + 1}).map((_, i) => {
              const pos = (CURVE_SIZE / GRID_DIVISIONS) * i;
              return (
                <React.Fragment key={`grid-${i}`}>
                  <Line
                    p1={{x: 0, y: pos}}
                    p2={{x: CURVE_SIZE, y: pos}}
                    color={colors.border.default}
                    style="stroke"
                    strokeWidth={1}
                  />
                  <Line
                    p1={{x: pos, y: 0}}
                    p2={{x: pos, y: CURVE_SIZE}}
                    color={colors.border.default}
                    style="stroke"
                    strokeWidth={1}
                  />
                </React.Fragment>
              );
            })}

            {/* Diagonal reference line */}
            <Line
              p1={{x: 0, y: CURVE_SIZE}}
              p2={{x: CURVE_SIZE, y: 0}}
              color={colors.text.tertiary}
              style="stroke"
              strokeWidth={1}
              opacity={0.3}
            />

            {/* Curve path */}
            <Path
              path={createCurvePath()}
              color={
                activeChannel === 'rgb'
                  ? colors.semantic.neutralWhite
                  : activeChannel === 'red'
                  ? colors.accent.coralRed
                  : activeChannel === 'green'
                  ? colors.accent.emeraldGreen
                  : colors.accent.electricBlue
              }
              style="stroke"
              strokeWidth={2}
            />

            {/* Control points */}
            {controlPoints.map(point => (
              <Circle
                key={point.id}
                cx={point.x}
                cy={point.y}
                r={selectedPointId === point.id ? 8 : 6}
                color={
                  activeChannel === 'rgb'
                    ? colors.semantic.neutralWhite
                    : activeChannel === 'red'
                    ? colors.accent.coralRed
                    : activeChannel === 'green'
                    ? colors.accent.emeraldGreen
                    : colors.accent.electricBlue
                }
              />
            ))}
          </Canvas>
        </GestureHandlerRootView>
      </View>

      {/* Presets */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Presets</Text>
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

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleReset}>
          <Icon name="refresh" size={20} color={colors.text.secondary} />
          <Text style={styles.actionText}>Reset</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Tap to add • Drag to adjust • Swipe down to remove</Text>
      </View>
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
  channelSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  channelButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.small,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
  },
  channelButtonActive: {
    backgroundColor: colors.primary.slateGray,
  },
  channelLabel: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '700',
  },
  curveContainer: {
    alignSelf: 'center',
    width: CURVE_SIZE,
    height: CURVE_SIZE,
    borderRadius: borderRadius.card,
    backgroundColor: colors.primary.carbonGray,
    overflow: 'hidden',
  },
  canvas: {
    width: CURVE_SIZE,
    height: CURVE_SIZE,
  },
  presetsContainer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  presetsTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  presetsList: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  presetLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  actions: {
    gap: spacing.sm,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  actionText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  hint: {
    ...typography.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
