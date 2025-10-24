/**
 * Filters Tool Component
 * Horizontal scrollable filter picker with intensity slider
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';
import {filters, FilterDefinition, applyIntensity} from '../filters/filterDefinitions';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const FILTER_PREVIEW_SIZE = 80;

interface FilterItemProps {
  filter: FilterDefinition;
  isSelected: boolean;
  onSelect: () => void;
  imageUri?: string;
}

const FilterItem: React.FC<FilterItemProps> = ({
  filter,
  isSelected,
  onSelect,
  imageUri,
}) => {
  const isPremium = useStore(state => state.isPremium);
  const isLocked = filter.premium && !isPremium;

  return (
    <TouchableOpacity
      style={styles.filterItem}
      onPress={onSelect}
      disabled={isLocked}
      activeOpacity={0.7}>
      <View
        style={[
          styles.filterPreview,
          isSelected && styles.filterPreviewSelected,
          isLocked && styles.filterPreviewLocked,
        ]}>
        {imageUri ? (
          <Image
            source={{uri: imageUri}}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.previewPlaceholder}>
            <Icon name="image" size={32} color={colors.text.tertiary} />
          </View>
        )}

        {/* Filter overlay simulation */}
        <View
          style={[
            styles.filterOverlay,
            {
              backgroundColor:
                filter.id === 'bw_classic'
                  ? colors.semantic.neutralBlack + '40'
                  : filter.id === 'warm_vintage'
                  ? colors.accent.coralRed + '20'
                  : filter.id === 'cool_blue'
                  ? colors.accent.electricBlue + '20'
                  : 'transparent',
            },
          ]}
        />

        {isLocked && (
          <View style={styles.filterLock}>
            <Icon name="lock-closed" size={16} color={colors.semantic.neutralWhite} />
          </View>
        )}

        {isSelected && (
          <View style={styles.selectedCheckmark}>
            <Icon name="checkmark-circle" size={24} color={colors.accent.electricBlue} />
          </View>
        )}
      </View>

      <Text
        style={[
          styles.filterName,
          isSelected && styles.filterNameSelected,
          isLocked && styles.filterNameLocked,
        ]}
        numberOfLines={2}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  );
};

interface FiltersToolProps {
  imageUri?: string;
  onFilterApply?: (filterId: string, intensity: number) => void;
}

export const FiltersTool: React.FC<FiltersToolProps> = ({
  imageUri,
  onFilterApply,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('original');
  const [intensity, setIntensity] = useState<number>(1.0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const isPremium = useStore(state => state.isPremium);
  const setFilter = useStore(state => state.setFilter);

  const handleFilterSelect = useCallback(
    (filter: FilterDefinition) => {
      if (filter.premium && !isPremium) {
        // Navigate to paywall
        return;
      }

      setSelectedFilter(filter.id);
      setIntensity(1.0);

      // Apply filter to state
      setFilter({
        id: filter.id,
        name: filter.name,
        intensity: 1.0,
        colorMatrix: filter.colorMatrix,
      });

      // Callback for parent component
      if (onFilterApply) {
        onFilterApply(filter.id, 1.0);
      }
    },
    [isPremium, setFilter, onFilterApply]
  );

  const handleIntensityChange = useCallback(
    (value: number) => {
      setIntensity(value);

      const currentFilter = filters.find(f => f.id === selectedFilter);
      if (currentFilter) {
        const adjustedMatrix = applyIntensity(currentFilter.colorMatrix, value);

        setFilter({
          id: currentFilter.id,
          name: currentFilter.name,
          intensity: value,
          colorMatrix: adjustedMatrix,
        });

        if (onFilterApply) {
          onFilterApply(currentFilter.id, value);
        }
      }
    },
    [selectedFilter, setFilter, onFilterApply]
  );

  const visibleFilters = showFavoritesOnly
    ? filters.filter(f => f.id === 'original' || f.id === 'bw_classic') // Placeholder for favorites
    : filters;

  return (
    <View style={styles.container}>
      {/* Filter Description */}
      <View style={styles.descriptionContainer}>
        <View style={styles.descriptionContent}>
          <Text style={styles.descriptionText}>
            {filters.find(f => f.id === selectedFilter)?.description ||
              'Select a filter'}
          </Text>
          {selectedFilter !== 'original' && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => {}}>
              <Icon name="heart-outline" size={20} color={colors.accent.coralRed} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter List */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        style={styles.filterScroll}>
        {visibleFilters.map(filter => (
          <FilterItem
            key={filter.id}
            filter={filter}
            isSelected={selectedFilter === filter.id}
            onSelect={() => handleFilterSelect(filter)}
            imageUri={imageUri}
          />
        ))}
      </ScrollView>

      {/* Intensity Slider */}
      {selectedFilter !== 'original' && (
        <View style={styles.intensityContainer}>
          <View style={styles.intensityHeader}>
            <Text style={styles.intensityLabel}>Intensity</Text>
            <Text style={styles.intensityValue}>
              {Math.round(intensity * 100)}%
            </Text>
          </View>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={intensity}
            onValueChange={handleIntensityChange}
            minimumTrackTintColor={colors.accent.electricBlue}
            maximumTrackTintColor={colors.primary.steelGray}
            thumbTintColor={colors.accent.electricBlue}
          />
        </View>
      )}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[
            styles.quickActionButton,
            showFavoritesOnly && styles.quickActionButtonActive,
          ]}
          onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}>
          <Icon
            name={showFavoritesOnly ? 'heart' : 'heart-outline'}
            size={20}
            color={
              showFavoritesOnly ? colors.accent.coralRed : colors.text.secondary
            }
          />
          <Text style={styles.quickActionText}>Favorites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quickActionButton}
          onPress={() => {
            setSelectedFilter('original');
            setIntensity(1.0);
            setFilter(null);
          }}>
          <Icon name="close-circle" size={20} color={colors.text.secondary} />
          <Text style={styles.quickActionText}>Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  descriptionContainer: {
    paddingHorizontal: spacing.md,
  },
  descriptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  descriptionText: {
    ...typography.body,
    color: colors.text.tertiary,
    flex: 1,
  },
  favoriteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.overlay.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterScroll: {
    maxHeight: FILTER_PREVIEW_SIZE + 60,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  filterItem: {
    alignItems: 'center',
    gap: spacing.xs,
    width: FILTER_PREVIEW_SIZE,
  },
  filterPreview: {
    width: FILTER_PREVIEW_SIZE,
    height: FILTER_PREVIEW_SIZE,
    borderRadius: borderRadius.card,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.small,
  },
  filterPreviewSelected: {
    borderColor: colors.accent.electricBlue,
    ...shadows.medium,
  },
  filterPreviewLocked: {
    opacity: 0.5,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary.slateGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  filterLock: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accent.vividPurple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCheckmark: {
    position: 'absolute',
    bottom: 4,
    right: 4,
  },
  filterName: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  filterNameSelected: {
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  filterNameLocked: {
    opacity: 0.5,
  },
  intensityContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  intensityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intensityLabel: {
    ...typography.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  intensityValue: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '700',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.button,
    backgroundColor: colors.overlay.light,
  },
  quickActionButtonActive: {
    backgroundColor: colors.accent.coralRed + '20',
  },
  quickActionText: {
    ...typography.body,
    color: colors.text.secondary,
    fontWeight: '600',
  },
});
