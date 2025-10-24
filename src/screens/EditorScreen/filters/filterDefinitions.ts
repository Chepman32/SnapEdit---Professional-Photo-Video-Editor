/**
 * Filter Definitions
 * 16 filters with color matrix transforms
 */

export interface FilterDefinition {
  id: string;
  name: string;
  premium: boolean;
  colorMatrix: number[];
  description: string;
}

/**
 * Color matrix format: 5x4 matrix (20 values)
 * [R, 0, 0, 0, R_offset,
 *  0, G, 0, 0, G_offset,
 *  0, 0, B, 0, B_offset,
 *  0, 0, 0, A, A_offset]
 */

export const filters: FilterDefinition[] = [
  // FREE FILTERS
  {
    id: 'original',
    name: 'Original',
    premium: false,
    colorMatrix: [
      1, 0, 0, 0, 0,
      0, 1, 0, 0, 0,
      0, 0, 1, 0, 0,
      0, 0, 0, 1, 0,
    ],
    description: 'No filter applied',
  },
  {
    id: 'bw_classic',
    name: 'B&W Classic',
    premium: false,
    colorMatrix: [
      0.3, 0.59, 0.11, 0, 0,
      0.3, 0.59, 0.11, 0, 0,
      0.3, 0.59, 0.11, 0, 0,
      0, 0, 0, 1, 0,
    ],
    description: 'Timeless black and white',
  },
  {
    id: 'warm_vintage',
    name: 'Warm Vintage',
    premium: false,
    colorMatrix: [
      1.2, 0, 0, 0, 20,
      0, 1.0, 0, 0, 10,
      0, 0, 0.8, 0, -10,
      0, 0, 0, 1, 0,
    ],
    description: 'Warm nostalgic tones',
  },
  {
    id: 'cool_blue',
    name: 'Cool Blue',
    premium: false,
    colorMatrix: [
      0.8, 0, 0, 0, -10,
      0, 0.9, 0, 0, 0,
      0, 0, 1.2, 0, 20,
      0, 0, 0, 1, 0,
    ],
    description: 'Cool blue atmosphere',
  },
  {
    id: 'high_contrast',
    name: 'High Contrast',
    premium: false,
    colorMatrix: [
      1.4, 0, 0, 0, -20,
      0, 1.4, 0, 0, -20,
      0, 0, 1.4, 0, -20,
      0, 0, 0, 1, 0,
    ],
    description: 'Bold contrast boost',
  },
  {
    id: 'soft_fade',
    name: 'Soft Fade',
    premium: false,
    colorMatrix: [
      0.9, 0, 0, 0, 25,
      0, 0.9, 0, 0, 25,
      0, 0, 0.9, 0, 25,
      0, 0, 0, 1, 0,
    ],
    description: 'Gentle faded look',
  },
  {
    id: 'vivid_pop',
    name: 'Vivid Pop',
    premium: false,
    colorMatrix: [
      1.3, 0, 0, 0, 0,
      0, 1.3, 0, 0, 0,
      0, 0, 1.3, 0, 0,
      0, 0, 0, 1, 0,
    ],
    description: 'Vibrant color pop',
  },
  {
    id: 'natural',
    name: 'Natural',
    premium: false,
    colorMatrix: [
      1.05, 0, 0, 0, 0,
      0, 1.05, 0, 0, 0,
      0, 0, 1.05, 0, 0,
      0, 0, 0, 1, 0,
    ],
    description: 'Subtle enhancement',
  },

  // PREMIUM FILTERS
  {
    id: 'cinematic_teal_orange',
    name: 'Cinematic',
    premium: true,
    colorMatrix: [
      1.2, 0, 0, 0, 15,
      0, 1.0, 0, 0, 5,
      0, 0, 1.1, 0, 10,
      0, 0, 0, 1, 0,
    ],
    description: 'Teal & orange blockbuster look',
  },
  {
    id: 'film_noir',
    name: 'Film Noir',
    premium: true,
    colorMatrix: [
      0.4, 0.5, 0.1, 0, -30,
      0.4, 0.5, 0.1, 0, -30,
      0.4, 0.5, 0.1, 0, -30,
      0, 0, 0, 1, 0,
    ],
    description: 'Dark dramatic noir',
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    premium: true,
    colorMatrix: [
      1.3, 0, 0, 0, 30,
      0, 1.1, 0, 0, 15,
      0, 0, 0.7, 0, -20,
      0, 0, 0, 1, 0,
    ],
    description: 'Magical sunset glow',
  },
  {
    id: 'arctic_freeze',
    name: 'Arctic Freeze',
    premium: true,
    colorMatrix: [
      0.7, 0, 0, 0, 0,
      0, 0.9, 0, 0, 10,
      0, 0, 1.4, 0, 30,
      0, 0, 0, 1, 0,
    ],
    description: 'Icy cold tones',
  },
  {
    id: 'desert_heat',
    name: 'Desert Heat',
    premium: true,
    colorMatrix: [
      1.4, 0, 0, 0, 40,
      0, 1.1, 0, 0, 20,
      0, 0, 0.6, 0, -30,
      0, 0, 0, 1, 0,
    ],
    description: 'Scorching desert warmth',
  },
  {
    id: 'urban_grit',
    name: 'Urban Grit',
    premium: true,
    colorMatrix: [
      1.1, 0, 0, 0, -15,
      0, 1.0, 0, 0, -10,
      0, 0, 0.9, 0, -5,
      0, 0, 0, 1, 0,
    ],
    description: 'Gritty street photography',
  },
  {
    id: 'dreamy_haze',
    name: 'Dreamy Haze',
    premium: true,
    colorMatrix: [
      0.95, 0, 0, 0, 40,
      0, 0.95, 0, 0, 35,
      0, 0, 1.0, 0, 40,
      0, 0, 0, 0.95, 0,
    ],
    description: 'Soft ethereal dream',
  },
  {
    id: 'neon_nights',
    name: 'Neon Nights',
    premium: true,
    colorMatrix: [
      1.2, 0, 0, 0, 0,
      0, 1.0, 0, 0, -20,
      0, 0, 1.4, 0, 30,
      0, 0, 0, 1, 0,
    ],
    description: 'Vibrant neon cyberpunk',
  },
];

/**
 * Apply intensity to a color matrix
 * @param matrix - The base color matrix
 * @param intensity - Value from 0 to 1
 * @returns Modified color matrix
 */
export const applyIntensity = (matrix: number[], intensity: number): number[] => {
  const identity = [
    1, 0, 0, 0, 0,
    0, 1, 0, 0, 0,
    0, 0, 1, 0, 0,
    0, 0, 0, 1, 0,
  ];

  return matrix.map((value, index) => {
    const identityValue = identity[index];
    return identityValue + (value - identityValue) * intensity;
  });
};
