/**
 * Editor Slice
 * Manages photo/video editing state
 */

import {StateCreator} from 'zustand';

export interface Adjustment {
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
  tint: number;
  exposure: number;
  highlights: number;
  shadows: number;
  sharpness: number;
  grain: number;
}

export interface Filter {
  name: string;
  intensity: number;
}

export interface DrawingLayer {
  id: string;
  strokes: any[];
  visible: boolean;
  opacity: number;
}

export interface TextLayer {
  id: string;
  text: string;
  position: {x: number; y: number};
  fontSize: number;
  color: string;
  fontFamily: string;
  visible: boolean;
  rotation: number;
}

export interface EditState {
  imageUri?: string;
  videoUri?: string;
  filter?: Filter;
  adjustments: Adjustment;
  drawingLayers: DrawingLayer[];
  textLayers: TextLayer[];
  cropData?: any;
}

export interface EditorSlice {
  currentImage?: string;
  currentVideo?: string;
  history: EditState[];
  historyIndex: number;
  currentState: EditState;

  // Actions
  loadImage: (uri: string) => void;
  loadVideo: (uri: string) => void;
  applyFilter: (filter: Filter) => void;
  applyAdjustment: (key: keyof Adjustment, value: number) => void;
  addDrawingLayer: (layer: DrawingLayer) => void;
  addTextLayer: (layer: TextLayer) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  saveState: () => void;
}

const defaultAdjustments: Adjustment = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  warmth: 0,
  tint: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  grain: 0,
};

const initialState: EditState = {
  adjustments: defaultAdjustments,
  drawingLayers: [],
  textLayers: [],
};

export const createEditorSlice: StateCreator<EditorSlice> = (set, get) => ({
  currentImage: undefined,
  currentVideo: undefined,
  history: [initialState],
  historyIndex: 0,
  currentState: initialState,

  loadImage: (uri) => {
    const newState: EditState = {
      ...initialState,
      imageUri: uri,
    };
    set({
      currentImage: uri,
      history: [newState],
      historyIndex: 0,
      currentState: newState,
    });
  },

  loadVideo: (uri) => {
    const newState: EditState = {
      ...initialState,
      videoUri: uri,
    };
    set({
      currentVideo: uri,
      history: [newState],
      historyIndex: 0,
      currentState: newState,
    });
  },

  applyFilter: (filter) => {
    const state = get();
    const newState = {
      ...state.currentState,
      filter,
    };
    get().saveState();
    set({currentState: newState});
  },

  applyAdjustment: (key, value) => {
    const state = get();
    const newAdjustments = {
      ...state.currentState.adjustments,
      [key]: value,
    };
    const newState = {
      ...state.currentState,
      adjustments: newAdjustments,
    };
    set({currentState: newState});
  },

  addDrawingLayer: (layer) => {
    const state = get();
    const newState = {
      ...state.currentState,
      drawingLayers: [...state.currentState.drawingLayers, layer],
    };
    get().saveState();
    set({currentState: newState});
  },

  addTextLayer: (layer) => {
    const state = get();
    const newState = {
      ...state.currentState,
      textLayers: [...state.currentState.textLayers, layer],
    };
    get().saveState();
    set({currentState: newState});
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      set({
        historyIndex: newIndex,
        currentState: state.history[newIndex],
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      set({
        historyIndex: newIndex,
        currentState: state.history[newIndex],
      });
    }
  },

  reset: () => {
    set({
      history: [initialState],
      historyIndex: 0,
      currentState: initialState,
    });
  },

  saveState: () => {
    const state = get();
    const newHistory = [
      ...state.history.slice(0, state.historyIndex + 1),
      state.currentState,
    ];
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
});
