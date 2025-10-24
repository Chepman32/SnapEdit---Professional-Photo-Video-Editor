/**
 * Gallery Slice
 * Manages gallery photos and selection state
 */

import {StateCreator} from 'zustand';

export interface Photo {
  id: string;
  uri: string;
  fileName: string;
  width: number;
  height: number;
  createdAt: Date;
  modifiedAt: Date;
  size: number;
  type: 'photo' | 'video';
  isEdited?: boolean;
  isFavorite?: boolean;
}

export type SortOption = 'date-newest' | 'date-oldest' | 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc';
export type FilterOption = 'all' | 'photos' | 'videos' | 'edited' | 'unedited' | 'favorites';

export interface GallerySlice {
  photos: Photo[];
  selectedPhotos: string[];
  sortBy: SortOption;
  filterBy: FilterOption;
  isSelectionMode: boolean;

  // Actions
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => void;
  removePhoto: (id: string) => void;
  selectPhoto: (id: string) => void;
  deselectPhoto: (id: string) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;
  setSortBy: (sortBy: SortOption) => void;
  setFilterBy: (filterBy: FilterOption) => void;
  setSelectionMode: (enabled: boolean) => void;
  toggleFavorite: (id: string) => void;
}

export const createGallerySlice: StateCreator<GallerySlice> = (set, get) => ({
  photos: [],
  selectedPhotos: [],
  sortBy: 'date-newest',
  filterBy: 'all',
  isSelectionMode: false,

  setPhotos: (photos) => {
    set({photos});
  },

  addPhoto: (photo) => {
    set((state) => ({
      photos: [photo, ...state.photos],
    }));
  },

  removePhoto: (id) => {
    set((state) => ({
      photos: state.photos.filter((p) => p.id !== id),
      selectedPhotos: state.selectedPhotos.filter((pid) => pid !== id),
    }));
  },

  selectPhoto: (id) => {
    set((state) => {
      if (state.selectedPhotos.includes(id)) {
        return state;
      }
      return {
        selectedPhotos: [...state.selectedPhotos, id],
        isSelectionMode: true,
      };
    });
  },

  deselectPhoto: (id) => {
    set((state) => {
      const newSelected = state.selectedPhotos.filter((pid) => pid !== id);
      return {
        selectedPhotos: newSelected,
        isSelectionMode: newSelected.length > 0,
      };
    });
  },

  toggleSelection: (id) => {
    const state = get();
    if (state.selectedPhotos.includes(id)) {
      state.deselectPhoto(id);
    } else {
      state.selectPhoto(id);
    }
  },

  clearSelection: () => {
    set({
      selectedPhotos: [],
      isSelectionMode: false,
    });
  },

  selectAll: () => {
    set((state) => ({
      selectedPhotos: state.photos.map((p) => p.id),
      isSelectionMode: true,
    }));
  },

  setSortBy: (sortBy) => {
    set({sortBy});
  },

  setFilterBy: (filterBy) => {
    set({filterBy});
  },

  setSelectionMode: (enabled) => {
    set({
      isSelectionMode: enabled,
      selectedPhotos: enabled ? [] : [],
    });
  },

  toggleFavorite: (id) => {
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id
          ? {...photo, isFavorite: !photo.isFavorite}
          : photo
      ),
    }));
  },
});
