/**
 * Animation Utilities Tests
 */

import {springAnimation, fadeIn, buttonPressAnimation} from '../animations';
import {Easing} from 'react-native-reanimated';

describe('Animation Utilities', () => {
  describe('springAnimation', () => {
    it('should create spring animation with default config', () => {
      const result = springAnimation(1);
      expect(result).toBeDefined();
    });

    it('should create spring animation with custom config', () => {
      const result = springAnimation(1, 'gentle');
      expect(result).toBeDefined();
    });
  });

  describe('fadeIn', () => {
    it('should create fade in animation with default duration', () => {
      const result = fadeIn();
      expect(result).toBeDefined();
    });

    it('should create fade in animation with custom duration', () => {
      const result = fadeIn('fast');
      expect(result).toBeDefined();
    });
  });

  describe('buttonPressAnimation', () => {
    it('should have press in animation', () => {
      const result = buttonPressAnimation.in();
      expect(result).toBeDefined();
    });

    it('should have press out animation', () => {
      const result = buttonPressAnimation.out();
      expect(result).toBeDefined();
    });
  });
});
