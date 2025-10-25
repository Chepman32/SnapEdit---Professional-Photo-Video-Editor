/**
 * Image Processing Service - Phase 24
 * Skia-based image manipulation and filters
 */

import {Skia, ImageFilter, ColorFilter, RuntimeEffect} from '@shopify/react-native-skia';

/**
 * Apply filter to image using color matrix
 */
export const applyColorMatrix = (colorMatrix: number[]) => {
  return ColorFilter.MakeMatrix(colorMatrix);
};

/**
 * Apply blur effect
 */
export const applyBlur = (radius: number) => {
  return ImageFilter.MakeBlur(radius, radius, 'clamp', null);
};

/**
 * Apply brightness adjustment
 */
export const applyBrightness = (value: number) => {
  // value: -100 to +100
  const factor = 1 + value / 100;
  const matrix = [
    factor, 0, 0, 0, 0,
    0, factor, 0, 0, 0,
    0, 0, factor, 0, 0,
    0, 0, 0, 1, 0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply contrast adjustment
 */
export const applyContrast = (value: number) => {
  // value: -100 to +100
  const factor = 1 + value / 100;
  const intercept = 128 * (1 - factor);
  const matrix = [
    factor, 0, 0, 0, intercept,
    0, factor, 0, 0, intercept,
    0, 0, factor, 0, intercept,
    0, 0, 0, 1, 0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply saturation adjustment
 */
export const applySaturation = (value: number) => {
  // value: -100 to +100
  const factor = 1 + value / 100;
  const lumR = 0.3086;
  const lumG = 0.6094;
  const lumB = 0.0820;

  const sr = (1 - factor) * lumR;
  const sg = (1 - factor) * lumG;
  const sb = (1 - factor) * lumB;

  const matrix = [
    sr + factor, sg, sb, 0, 0,
    sr, sg + factor, sb, 0, 0,
    sr, sg, sb + factor, 0, 0,
    0, 0, 0, 1, 0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply hue rotation
 */
export const applyHueRotation = (degrees: number) => {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const matrix = [
    0.213 + cos * 0.787 - sin * 0.213,
    0.715 - cos * 0.715 - sin * 0.715,
    0.072 - cos * 0.072 + sin * 0.928,
    0,
    0,
    0.213 - cos * 0.213 + sin * 0.143,
    0.715 + cos * 0.285 + sin * 0.140,
    0.072 - cos * 0.072 - sin * 0.283,
    0,
    0,
    0.213 - cos * 0.213 - sin * 0.787,
    0.715 - cos * 0.715 + sin * 0.715,
    0.072 + cos * 0.928 + sin * 0.072,
    0,
    0,
    0,
    0,
    0,
    1,
    0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply temperature adjustment (warmth)
 */
export const applyTemperature = (value: number) => {
  // value: -100 to +100
  const factor = value / 100;

  let matrix: number[];
  if (factor > 0) {
    // Warm: increase red, decrease blue
    matrix = [
      1 + factor * 0.3, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1 - factor * 0.3, 0, 0,
      0, 0, 0, 1, 0,
    ];
  } else {
    // Cool: decrease red, increase blue
    matrix = [
      1 + factor * 0.3, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1 - factor * 0.3, 0, 0,
      0, 0, 0, 1, 0,
    ];
  }

  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply vignette effect
 */
export const createVignetteShader = (strength: number) => {
  const source = Skia.RuntimeEffect.Make(`
    uniform shader image;
    uniform float strength;
    uniform vec2 resolution;

    half4 main(vec2 xy) {
      vec2 uv = xy / resolution;
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(uv, center);
      float vignette = smoothstep(0.8, 0.2, dist * strength);

      half4 color = image.eval(xy);
      return color * vignette;
    }
  `)!;

  return source;
};

/**
 * Apply sharpness
 */
export const applySharpness = (value: number) => {
  // value: 0 to 100
  // Sharpness is typically applied as a convolution filter
  // For simplicity, we'll use a basic implementation
  return ImageFilter.MakeBlur(-(value / 100), -(value / 100), 'clamp', null);
};

/**
 * Apply exposure adjustment
 */
export const applyExposure = (value: number) => {
  // value: -100 to +100
  const factor = Math.pow(2, value / 100);
  const matrix = [
    factor, 0, 0, 0, 0,
    0, factor, 0, 0, 0,
    0, 0, factor, 0, 0,
    0, 0, 0, 1, 0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply highlights adjustment
 */
export const applyHighlights = (value: number) => {
  // value: -100 to +100
  // Simplified highlights adjustment
  const factor = 1 + value / 200;
  const offset = value > 0 ? -value / 2 : 0;

  const matrix = [
    factor, 0, 0, 0, offset,
    0, factor, 0, 0, offset,
    0, 0, factor, 0, offset,
    0, 0, 0, 1, 0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply shadows adjustment
 */
export const applyShadows = (value: number) => {
  // value: -100 to +100
  // Simplified shadows adjustment
  const factor = 1 + value / 200;
  const offset = value > 0 ? value / 2 : 0;

  const matrix = [
    factor, 0, 0, 0, offset,
    0, factor, 0, 0, offset,
    0, 0, factor, 0, offset,
    0, 0, 0, 1, 0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Apply vibrance adjustment
 */
export const applyVibrance = (value: number) => {
  // value: -100 to +100
  // Similar to saturation but more subtle
  const factor = 1 + value / 150;
  const lumR = 0.3086;
  const lumG = 0.6094;
  const lumB = 0.0820;

  const sr = (1 - factor) * lumR;
  const sg = (1 - factor) * lumG;
  const sb = (1 - factor) * lumB;

  const matrix = [
    sr + factor, sg, sb, 0, 0,
    sr, sg + factor, sb, 0, 0,
    sr, sg, sb + factor, 0, 0,
    0, 0, 0, 1, 0,
  ];
  return ColorFilter.MakeMatrix(matrix);
};

/**
 * Combine multiple adjustments into a single color matrix
 */
export const combineAdjustments = (adjustments: {
  exposure?: number;
  contrast?: number;
  highlights?: number;
  shadows?: number;
  vibrance?: number;
  saturation?: number;
  warmth?: number;
  tint?: number;
}) => {
  // Create identity matrix
  let resultMatrix = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
  ];

  // Helper to multiply matrices
  const multiplyMatrices = (a: number[], b: number[]) => {
    const result = new Array(20).fill(0);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[row * 5 + k] * b[k * 5 + col];
        }
        if (col === 4) {
          sum += a[row * 5 + 4];
        }
        result[row * 5 + col] = sum;
      }
    }

    return result;
  };

  // Apply each adjustment
  if (adjustments.exposure !== undefined && adjustments.exposure !== 0) {
    const factor = Math.pow(2, adjustments.exposure / 100);
    const matrix = [
      factor, 0, 0, 0, 0,
      0, factor, 0, 0, 0,
      0, 0, factor, 0, 0,
      0, 0, 0, 1, 0,
    ];
    resultMatrix = multiplyMatrices(resultMatrix, matrix);
  }

  if (adjustments.contrast !== undefined && adjustments.contrast !== 0) {
    const factor = 1 + adjustments.contrast / 100;
    const intercept = 128 * (1 - factor);
    const matrix = [
      factor, 0, 0, 0, intercept,
      0, factor, 0, 0, intercept,
      0, 0, factor, 0, intercept,
      0, 0, 0, 1, 0,
    ];
    resultMatrix = multiplyMatrices(resultMatrix, matrix);
  }

  if (adjustments.saturation !== undefined && adjustments.saturation !== 0) {
    const factor = 1 + adjustments.saturation / 100;
    const lumR = 0.3086;
    const lumG = 0.6094;
    const lumB = 0.0820;

    const sr = (1 - factor) * lumR;
    const sg = (1 - factor) * lumG;
    const sb = (1 - factor) * lumB;

    const matrix = [
      sr + factor, sg, sb, 0, 0,
      sr, sg + factor, sb, 0, 0,
      sr, sg, sb + factor, 0, 0,
      0, 0, 0, 1, 0,
    ];
    resultMatrix = multiplyMatrices(resultMatrix, matrix);
  }

  return ColorFilter.MakeMatrix(resultMatrix);
};

/**
 * Create lookup table (LUT) based filter
 */
export const createLUTFilter = (lutData: number[]) => {
  // LUT-based color grading
  // This would require actual LUT data for professional color grading
  return ColorFilter.MakeMatrix([
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
  ]);
};

/**
 * Image metadata extraction
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  orientation?: number;
  exif?: Record<string, any>;
}

export const extractImageMetadata = async (
  imageUri: string
): Promise<ImageMetadata> => {
  // Placeholder - would use react-native-image-resizer or similar
  return {
    width: 1920,
    height: 1080,
    format: 'jpg',
  };
};

/**
 * Resize image
 */
export interface ResizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpg' | 'png' | 'heic';
  maintainAspectRatio?: boolean;
}

export const resizeImage = async (
  imageUri: string,
  options: ResizeOptions
): Promise<string> => {
  // Placeholder - would use react-native-image-resizer
  console.log('Resizing image:', imageUri, options);
  return imageUri;
};

/**
 * Crop image
 */
export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const cropImage = async (
  imageUri: string,
  options: CropOptions
): Promise<string> => {
  // Placeholder - would use react-native-image-crop-picker
  console.log('Cropping image:', imageUri, options);
  return imageUri;
};

/**
 * Rotate image
 */
export const rotateImage = async (
  imageUri: string,
  degrees: number
): Promise<string> => {
  // Placeholder - would use react-native-image-resizer
  console.log('Rotating image:', imageUri, degrees);
  return imageUri;
};

/**
 * Flip image
 */
export const flipImage = async (
  imageUri: string,
  horizontal: boolean,
  vertical: boolean
): Promise<string> => {
  // Placeholder - would use react-native-image-resizer
  console.log('Flipping image:', imageUri, {horizontal, vertical});
  return imageUri;
};

/**
 * Save image with metadata
 */
export interface SaveOptions {
  quality?: number;
  format?: 'jpg' | 'png' | 'heic';
  preserveMetadata?: boolean;
}

export const saveImage = async (
  imageUri: string,
  options: SaveOptions = {}
): Promise<string> => {
  // Placeholder - would use CameraRoll or similar
  console.log('Saving image:', imageUri, options);
  return imageUri;
};

export const imageProcessingService = {
  applyColorMatrix,
  applyBlur,
  applyBrightness,
  applyContrast,
  applySaturation,
  applyHueRotation,
  applyTemperature,
  applySharpness,
  applyExposure,
  applyHighlights,
  applyShadows,
  applyVibrance,
  combineAdjustments,
  createVignetteShader,
  createLUTFilter,
  extractImageMetadata,
  resizeImage,
  cropImage,
  rotateImage,
  flipImage,
  saveImage,
};
