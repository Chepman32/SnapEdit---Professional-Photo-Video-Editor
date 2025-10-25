/**
 * Video Editor Screen
 * Phase 19: Timeline-based video editing with trim, filters, and effects
 */

import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

interface VideoEditorParams {
  videoUri: string;
  duration?: number;
}

type VideoEditorScreenRouteProp = RouteProp<{VideoEditor: VideoEditorParams}, 'VideoEditor'>;

type VideoTool = 'trim' | 'speed' | 'filters' | 'audio' | 'effects' | 'text';

interface TimelineMarker {
  id: string;
  type: 'cut' | 'filter' | 'effect' | 'text';
  position: number; // 0-1 normalized position
  label: string;
}

const tools: Array<{id: VideoTool; icon: string; label: string; premium?: boolean}> = [
  {id: 'trim', icon: 'cut', label: 'Trim'},
  {id: 'speed', icon: 'speedometer', label: 'Speed'},
  {id: 'filters', icon: 'color-filter', label: 'Filters'},
  {id: 'audio', icon: 'musical-notes', label: 'Audio'},
  {id: 'effects', icon: 'flask', label: 'Effects', premium: true},
  {id: 'text', icon: 'text', label: 'Text'},
];

const speedPresets = [
  {id: '0.25x', value: 0.25, label: '0.25×'},
  {id: '0.5x', value: 0.5, label: '0.5×'},
  {id: '1x', value: 1.0, label: '1×'},
  {id: '1.5x', value: 1.5, label: '1.5×'},
  {id: '2x', value: 2.0, label: '2×'},
];

export const VideoEditorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<VideoEditorScreenRouteProp>();
  const {videoUri, duration = 30} = route.params;

  const isPremium = useStore(state => state.isPremium);

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(duration);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(100);

  // Tool state
  const [activeTool, setActiveTool] = useState<VideoTool | null>(null);
  const [markers, setMarkers] = useState<TimelineMarker[]>([]);

  // Animation
  const playheadPosition = useSharedValue(0);

  useEffect(() => {
    // Simulate video playback
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 0.1 * playbackSpeed;
          if (newTime >= trimEnd) {
            setIsPlaying(false);
            return trimStart;
          }
          playheadPosition.value = withTiming(newTime / duration, {duration: 100});
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, trimEnd, trimStart, duration, playbackSpeed, playheadPosition]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
    playheadPosition.value = time / duration;
  }, [duration, playheadPosition]);

  const handleToolSelect = useCallback((tool: VideoTool) => {
    if (tool === 'effects' && !isPremium) return;
    setActiveTool(current => current === tool ? null : tool);
  }, [isPremium]);

  const handleAddMarker = useCallback((type: TimelineMarker['type']) => {
    const newMarker: TimelineMarker = {
      id: Date.now().toString(),
      type,
      position: currentTime / duration,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    };
    setMarkers(prev => [...prev, newMarker]);
  }, [currentTime, duration]);

  const handleExport = useCallback(() => {
    console.log('Export video with settings:', {
      trimStart,
      trimEnd,
      speed: playbackSpeed,
      muted: isMuted,
      volume,
      markers,
    });
  }, [trimStart, trimEnd, playbackSpeed, isMuted, volume, markers]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playheadStyle = useAnimatedStyle(() => ({
    left: `${playheadPosition.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.topButton}>
            <Icon name="close" size={28} color={colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.topCenter}>
            <Text style={styles.topTitle}>Video Editor</Text>
            <Text style={styles.topDuration}>
              {formatTime(currentTime)} / {formatTime(trimEnd - trimStart)}
            </Text>
          </View>

          <TouchableOpacity style={styles.topButton} onPress={handleExport}>
            <Icon name="checkmark" size={28} color={colors.accent.emeraldGreen} />
          </TouchableOpacity>
        </View>

        {/* Video Preview */}
        <View style={styles.videoPreview}>
          <View style={styles.videoPlaceholder}>
            <Icon name="videocam" size={64} color={colors.text.tertiary} />
            <Text style={styles.videoPlaceholderText}>Video Preview</Text>
          </View>

          {/* Playback Controls Overlay */}
          <View style={styles.playbackOverlay}>
            <TouchableOpacity
              style={styles.playbackButton}
              onPress={handlePlayPause}>
              <LinearGradient
                colors={[colors.accent.electricBlue + 'CC', colors.accent.vividPurple + 'CC']}
                style={styles.playbackButtonGradient}>
                <Icon
                  name={isPlaying ? 'pause' : 'play'}
                  size={48}
                  color={colors.semantic.neutralWhite}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Timeline Info */}
          <View style={styles.timelineInfo}>
            <Text style={styles.timelineInfoText}>
              {formatTime(currentTime)}
            </Text>
            <View style={styles.timelineInfoDot} />
            <Text style={styles.timelineInfoText}>
              {playbackSpeed}× speed
            </Text>
            {isMuted && (
              <>
                <View style={styles.timelineInfoDot} />
                <Icon name="volume-mute" size={16} color={colors.text.secondary} />
              </>
            )}
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineTitle}>Timeline</Text>
            <View style={styles.timelineControls}>
              <TouchableOpacity
                style={styles.timelineControl}
                onPress={() => handleSeek(Math.max(0, currentTime - 1))}>
                <Icon name="play-back" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.timelineControl}
                onPress={() => handleSeek(Math.min(duration, currentTime + 1))}>
                <Icon name="play-forward" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Timeline Track */}
          <View style={styles.timelineTrack}>
            {/* Time markers */}
            <View style={styles.timeMarkers}>
              {Array.from({length: 11}).map((_, i) => (
                <View key={i} style={styles.timeMarkerGroup}>
                  <View style={styles.timeMarkerLine} />
                  <Text style={styles.timeMarkerText}>
                    {formatTime((duration * i) / 10)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Trim indicators */}
            <View style={styles.trimContainer}>
              <View style={[styles.trimHandle, {left: `${(trimStart / duration) * 100}%`}]}>
                <View style={styles.trimHandleBar} />
              </View>
              <View style={[styles.trimHandle, {left: `${(trimEnd / duration) * 100}%`}]}>
                <View style={styles.trimHandleBar} />
              </View>
            </View>

            {/* Markers */}
            {markers.map(marker => (
              <View
                key={marker.id}
                style={[
                  styles.marker,
                  {left: `${marker.position * 100}%`},
                ]}>
                <Icon
                  name={
                    marker.type === 'cut' ? 'cut' :
                    marker.type === 'filter' ? 'color-filter' :
                    marker.type === 'effect' ? 'flask' : 'text'
                  }
                  size={16}
                  color={colors.accent.electricBlue}
                />
              </View>
            ))}

            {/* Playhead */}
            <Animated.View style={[styles.playhead, playheadStyle]}>
              <View style={styles.playheadHandle} />
              <View style={styles.playheadLine} />
            </Animated.View>
          </View>

          {/* Timeline Scrubber */}
          <Slider
            style={styles.timelineScrubber}
            minimumValue={0}
            maximumValue={duration}
            value={currentTime}
            onValueChange={handleSeek}
            minimumTrackTintColor={colors.accent.electricBlue}
            maximumTrackTintColor={colors.primary.steelGray}
            thumbTintColor={colors.accent.electricBlue}
          />
        </View>

        {/* Tools Bar */}
        <View style={styles.toolsBar}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolsList}>
            {tools.map(tool => {
              const isLocked = tool.premium && !isPremium;
              const isActive = activeTool === tool.id;

              return (
                <TouchableOpacity
                  key={tool.id}
                  style={[styles.toolButton, isActive && styles.toolButtonActive]}
                  onPress={() => handleToolSelect(tool.id)}
                  disabled={isLocked}>
                  <View style={styles.toolIconContainer}>
                    <Icon
                      name={tool.icon}
                      size={24}
                      color={isActive ? colors.accent.electricBlue : colors.text.secondary}
                    />
                    {isLocked && (
                      <View style={styles.toolLock}>
                        <Icon name="lock-closed" size={12} color={colors.semantic.neutralWhite} />
                      </View>
                    )}
                  </View>
                  <Text style={[styles.toolLabel, isActive && styles.toolLabelActive]}>
                    {tool.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Tool Panel */}
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
                {/* Trim Tool */}
                {activeTool === 'trim' && (
                  <View style={styles.trimTool}>
                    <View style={styles.trimRow}>
                      <Text style={styles.trimLabel}>Start</Text>
                      <Text style={styles.trimValue}>{formatTime(trimStart)}</Text>
                      <Slider
                        style={styles.trimSlider}
                        minimumValue={0}
                        maximumValue={trimEnd - 1}
                        value={trimStart}
                        onValueChange={setTrimStart}
                        minimumTrackTintColor={colors.accent.electricBlue}
                        maximumTrackTintColor={colors.primary.steelGray}
                        thumbTintColor={colors.accent.electricBlue}
                      />
                    </View>
                    <View style={styles.trimRow}>
                      <Text style={styles.trimLabel}>End</Text>
                      <Text style={styles.trimValue}>{formatTime(trimEnd)}</Text>
                      <Slider
                        style={styles.trimSlider}
                        minimumValue={trimStart + 1}
                        maximumValue={duration}
                        value={trimEnd}
                        onValueChange={setTrimEnd}
                        minimumTrackTintColor={colors.accent.electricBlue}
                        maximumTrackTintColor={colors.primary.steelGray}
                        thumbTintColor={colors.accent.electricBlue}
                      />
                    </View>
                  </View>
                )}

                {/* Speed Tool */}
                {activeTool === 'speed' && (
                  <View style={styles.speedTool}>
                    <View style={styles.speedPresets}>
                      {speedPresets.map(preset => (
                        <TouchableOpacity
                          key={preset.id}
                          style={[
                            styles.speedPreset,
                            playbackSpeed === preset.value && styles.speedPresetActive,
                          ]}
                          onPress={() => setPlaybackSpeed(preset.value)}>
                          <Text
                            style={[
                              styles.speedPresetText,
                              playbackSpeed === preset.value && styles.speedPresetTextActive,
                            ]}>
                            {preset.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.speedCustom}>
                      <Text style={styles.speedLabel}>Custom Speed</Text>
                      <Slider
                        style={styles.speedSlider}
                        minimumValue={0.25}
                        maximumValue={4.0}
                        value={playbackSpeed}
                        onValueChange={setPlaybackSpeed}
                        step={0.25}
                        minimumTrackTintColor={colors.accent.electricBlue}
                        maximumTrackTintColor={colors.primary.steelGray}
                        thumbTintColor={colors.accent.electricBlue}
                      />
                      <Text style={styles.speedValue}>{playbackSpeed.toFixed(2)}×</Text>
                    </View>
                  </View>
                )}

                {/* Audio Tool */}
                {activeTool === 'audio' && (
                  <View style={styles.audioTool}>
                    <TouchableOpacity
                      style={styles.audioRow}
                      onPress={() => setIsMuted(!isMuted)}>
                      <Icon
                        name={isMuted ? 'volume-mute' : 'volume-high'}
                        size={24}
                        color={colors.text.secondary}
                      />
                      <Text style={styles.audioLabel}>
                        {isMuted ? 'Unmute' : 'Mute'}
                      </Text>
                      <View style={[styles.toggle, isMuted && styles.toggleActive]}>
                        <View style={[styles.toggleThumb, isMuted && styles.toggleThumbActive]} />
                      </View>
                    </TouchableOpacity>
                    {!isMuted && (
                      <View style={styles.volumeControl}>
                        <Icon name="volume-low" size={20} color={colors.text.tertiary} />
                        <Slider
                          style={styles.volumeSlider}
                          minimumValue={0}
                          maximumValue={100}
                          value={volume}
                          onValueChange={setVolume}
                          minimumTrackTintColor={colors.accent.electricBlue}
                          maximumTrackTintColor={colors.primary.steelGray}
                          thumbTintColor={colors.accent.electricBlue}
                        />
                        <Icon name="volume-high" size={20} color={colors.text.tertiary} />
                        <Text style={styles.volumeValue}>{Math.round(volume)}%</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Other tools placeholder */}
                {!['trim', 'speed', 'audio'].includes(activeTool) && (
                  <Text style={styles.toolPlaceholder}>
                    {activeTool} tool options will appear here
                  </Text>
                )}
              </View>
            </LinearGradient>
          </View>
        )}
      </SafeAreaView>
    </View>
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
  topButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topCenter: {
    alignItems: 'center',
    gap: 4,
  },
  topTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  topDuration: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  videoPreview: {
    height: SCREEN_HEIGHT * 0.35,
    backgroundColor: colors.primary.carbonGray,
    position: 'relative',
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  videoPlaceholderText: {
    ...typography.body,
    color: colors.text.tertiary,
  },
  playbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    ...shadows.strong,
  },
  playbackButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineInfo: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary.obsidianBlack + 'DD',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.button,
  },
  timelineInfoText: {
    ...typography.caption,
    color: colors.text.primary,
    fontWeight: '600',
  },
  timelineInfoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.tertiary,
  },
  timelineContainer: {
    padding: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  timelineControls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timelineControl: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineTrack: {
    height: 60,
    position: 'relative',
    backgroundColor: colors.primary.slateGray,
    borderRadius: borderRadius.small,
    overflow: 'visible',
  },
  timeMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingTop: spacing.xs,
  },
  timeMarkerGroup: {
    alignItems: 'center',
    gap: 2,
  },
  timeMarkerLine: {
    width: 1,
    height: 8,
    backgroundColor: colors.text.tertiary,
  },
  timeMarkerText: {
    ...typography.caption,
    fontSize: 9,
    color: colors.text.tertiary,
  },
  trimContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  trimHandle: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.accent.coralRed,
  },
  trimHandleBar: {
    position: 'absolute',
    top: -4,
    left: -4,
    width: 11,
    height: 20,
    backgroundColor: colors.accent.coralRed,
    borderRadius: 2,
  },
  marker: {
    position: 'absolute',
    top: -8,
    width: 24,
    height: 24,
    marginLeft: -12,
    borderRadius: 12,
    backgroundColor: colors.primary.obsidianBlack,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  },
  playhead: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.accent.electricBlue,
  },
  playheadHandle: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.accent.electricBlue,
    borderWidth: 2,
    borderColor: colors.semantic.neutralWhite,
  },
  playheadLine: {
    flex: 1,
    backgroundColor: colors.accent.electricBlue,
  },
  timelineScrubber: {
    width: '100%',
    height: 40,
  },
  toolsBar: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
    paddingVertical: spacing.sm,
  },
  toolsList: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  toolButton: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
    minWidth: 60,
  },
  toolButtonActive: {
    backgroundColor: colors.overlay.light,
  },
  toolIconContainer: {
    position: 'relative',
  },
  toolLock: {
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
    fontWeight: '700',
  },
  toolPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
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
  },
  toolPlaceholder: {
    ...typography.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  trimTool: {
    gap: spacing.lg,
  },
  trimRow: {
    gap: spacing.sm,
  },
  trimLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  trimValue: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '700',
  },
  trimSlider: {
    width: '100%',
    height: 40,
  },
  speedTool: {
    gap: spacing.lg,
  },
  speedPresets: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  speedPreset: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.card,
    backgroundColor: colors.overlay.light,
    alignItems: 'center',
  },
  speedPresetActive: {
    backgroundColor: colors.accent.electricBlue + '20',
  },
  speedPresetText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  speedPresetTextActive: {
    color: colors.accent.electricBlue,
  },
  speedCustom: {
    gap: spacing.sm,
  },
  speedLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  speedSlider: {
    width: '100%',
    height: 40,
  },
  speedValue: {
    ...typography.bodyLarge,
    color: colors.accent.electricBlue,
    fontWeight: '700',
    textAlign: 'center',
  },
  audioTool: {
    gap: spacing.lg,
  },
  audioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  audioLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
    flex: 1,
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
  volumeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  volumeSlider: {
    flex: 1,
    height: 40,
  },
  volumeValue: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '700',
    minWidth: 45,
    textAlign: 'right',
  },
});
