/**
 * Gallery Screen - Complete Implementation
 * Phase 9: Photo grid with albums, selection, sorting, and filtering
 */

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors, typography, spacing, borderRadius, shadows} from '@theme';
import {useStore} from '@/store';
import type {Photo, SortOption, FilterOption} from '@/store';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const COLUMNS = 3;
const GAP = 2;
const ITEM_SIZE = (SCREEN_WIDTH - GAP * (COLUMNS + 1)) / COLUMNS;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface PhotoItemProps {
  photo: Photo;
  isSelected: boolean;
  selectionMode: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({
  photo,
  isSelected,
  selectionMode,
  onPress,
  onLongPress,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <AnimatedTouchable
      style={[styles.photoItem, animatedStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}>
      <Image
        source={{uri: photo.uri}}
        style={styles.photoImage}
        resizeMode="cover"
      />

      {/* Video indicator */}
      {photo.type === 'video' && (
        <View style={styles.videoIndicator}>
          <Icon name="play-circle" size={32} color={colors.semantic.neutralWhite} />
        </View>
      )}

      {/* Edited indicator */}
      {photo.isEdited && (
        <View style={styles.editedIndicator}>
          <View style={styles.editedDot} />
        </View>
      )}

      {/* Selection overlay */}
      {selectionMode && (
        <View style={[styles.selectionOverlay, isSelected && styles.selected]}>
          {isSelected && (
            <View style={styles.checkmarkContainer}>
              <Icon
                name="checkmark-circle"
                size={32}
                color={colors.accent.electricBlue}
              />
            </View>
          )}
        </View>
      )}
    </AnimatedTouchable>
  );
};

const SortFilterModal: React.FC<{
  visible: boolean;
  type: 'sort' | 'filter';
  onClose: () => void;
  onSelect: (value: any) => void;
  currentValue: any;
}> = ({visible, type, onClose, onSelect, currentValue}) => {
  const options =
    type === 'sort'
      ? [
          {label: 'Date: Newest First', value: 'date-newest'},
          {label: 'Date: Oldest First', value: 'date-oldest'},
          {label: 'Name: A to Z', value: 'name-asc'},
          {label: 'Name: Z to A', value: 'name-desc'},
        ]
      : [
          {label: 'All Media', value: 'all'},
          {label: 'Photos Only', value: 'photos'},
          {label: 'Videos Only', value: 'videos'},
          {label: 'Edited', value: 'edited'},
          {label: 'Favorites', value: 'favorites'},
        ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>
            {type === 'sort' ? 'Sort By' : 'Filter'}
          </Text>

          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.modalOption}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}>
              <Text style={styles.modalOptionText}>{option.label}</Text>
              {currentValue === option.value && (
                <Icon
                  name="checkmark-circle"
                  size={24}
                  color={colors.accent.electricBlue}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export const GalleryScreen = () => {
  const navigation = useNavigation();
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const {
    photos,
    selectedPhotos,
    isSelectionMode,
    sortBy,
    filterBy,
  } = useStore(state => ({
    photos: state.photos,
    selectedPhotos: state.selectedPhotos,
    isSelectionMode: state.isSelectionMode,
    sortBy: state.sortBy,
    filterBy: state.filterBy,
  }));

  const toggleSelection = useStore(state => state.toggleSelection);
  const setSelectionMode = useStore(state => state.setSelectionMode);
  const clearSelection = useStore(state => state.clearSelection);
  const setSortBy = useStore(state => state.setSortBy);
  const setFilterBy = useStore(state => state.setFilterBy);

  const handlePhotoPress = useCallback(
    (photo: Photo) => {
      if (isSelectionMode) {
        toggleSelection(photo.id);
      } else {
        navigation.navigate('Editor' as never, {
          imageUri: photo.uri,
          imageId: photo.id,
        } as never);
      }
    },
    [isSelectionMode, navigation, toggleSelection]
  );

  const handlePhotoLongPress = useCallback(
    (photo: Photo) => {
      if (!isSelectionMode) {
        setSelectionMode(true);
        toggleSelection(photo.id);
      }
    },
    [isSelectionMode, setSelectionMode, toggleSelection]
  );

  const handleCancelSelection = () => {
    clearSelection();
    setSelectionMode(false);
  };

  const renderPhoto = ({item}: {item: Photo}) => (
    <PhotoItem
      photo={item}
      isSelected={selectedPhotos.includes(item.id)}
      selectionMode={isSelectionMode}
      onPress={() => handlePhotoPress(item)}
      onLongPress={() => handlePhotoLongPress(item)}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Icon name="images-outline" size={80} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No Photos Yet</Text>
      <Text style={styles.emptyText}>
        Import photos from your library to get started
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon
            name="chevron-back"
            size={28}
            color={colors.accent.electricBlue}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.headerTitle}>
            {isSelectionMode
              ? `${selectedPhotos.length} selected`
              : 'Gallery'}
          </Text>
        </View>

        <View style={styles.headerRight}>
          {isSelectionMode ? (
            <TouchableOpacity onPress={handleCancelSelection}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowSortModal(true)}>
                <Icon
                  name="swap-vertical"
                  size={24}
                  color={colors.text.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => setShowFilterModal(true)}>
                <Icon name="funnel-outline" size={24} color={colors.text.primary} />
                {filterBy !== 'all' && <View style={styles.filterDot} />}
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Photo Grid */}
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.gridContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* Selection Actions */}
      {isSelectionMode && selectedPhotos.length > 0 && (
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="create" size={28} color={colors.text.primary} />
            <Text style={styles.actionLabel}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="share-social" size={28} color={colors.text.primary} />
            <Text style={styles.actionLabel}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="trash" size={28} color={colors.accent.coralRed} />
            <Text style={[styles.actionLabel, {color: colors.accent.coralRed}]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FAB */}
      {!isSelectionMode && (
        <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
          <Icon name="add" size={32} color={colors.semantic.neutralWhite} />
        </TouchableOpacity>
      )}

      {/* Modals */}
      <SortFilterModal
        visible={showSortModal}
        type="sort"
        currentValue={sortBy}
        onSelect={(value: SortOption) => setSortBy(value)}
        onClose={() => setShowSortModal(false)}
      />
      <SortFilterModal
        visible={showFilterModal}
        type="filter"
        currentValue={filterBy}
        onSelect={(value: FilterOption) => setFilterBy(value)}
        onClose={() => setShowFilterModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.obsidianBlack,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border.default,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    ...typography.body,
    color: colors.accent.electricBlue,
    fontWeight: '600',
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.electricBlue,
  },
  gridContent: {
    paddingTop: GAP,
  },
  row: {
    gap: GAP,
    paddingHorizontal: GAP,
    marginBottom: GAP,
  },
  photoItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: colors.primary.carbonGray,
    borderRadius: 2,
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  editedIndicator: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  editedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.electricBlue,
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  selected: {
    backgroundColor: 'rgba(10, 132, 255, 0.2)',
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.screenPadding,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text.tertiary,
    marginTop: spacing.lg,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.tertiary,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  actionBar: {
    height: 80,
    backgroundColor: colors.primary.carbonGray,
    borderTopWidth: 0.5,
    borderTopColor: colors.border.default,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    ...shadows.strong,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text.primary,
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent.electricBlue,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.dramatic,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.primary.carbonGray,
    borderTopLeftRadius: borderRadius.xlarge,
    borderTopRightRadius: borderRadius.xlarge,
    paddingBottom: spacing.xxl,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border.default,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  modalOptionText: {
    ...typography.body,
    color: colors.text.primary,
  },
});
