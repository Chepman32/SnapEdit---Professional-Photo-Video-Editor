/**
 * User Slice
 * Manages user authentication and profile state
 */

import {StateCreator} from 'zustand';
import {storageService} from '@services/storage';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'yearly' | 'lifetime';
  subscriptionEndDate?: Date;
}

export interface UserSlice {
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  setPremiumStatus: (isPremium: boolean, type?: User['subscriptionType']) => void;
}

export const createUserSlice: StateCreator<UserSlice> = (set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    set({user, isAuthenticated: true});
    storageService.setObject('user', user);
  },

  login: (user) => {
    set({user, isAuthenticated: true});
    storageService.setObject('user', user);
  },

  logout: () => {
    set({user: null, isAuthenticated: false});
    storageService.delete('user');
  },

  updateProfile: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = {...state.user, ...updates};
      storageService.setObject('user', updatedUser);
      return {user: updatedUser};
    });
  },

  setPremiumStatus: (isPremium, type) => {
    set((state) => {
      if (!state.user) return state;
      const updatedUser = {
        ...state.user,
        isPremium,
        subscriptionType: type,
      };
      storageService.setObject('user', updatedUser);
      storageService.setBoolean('isPremium', isPremium);
      return {user: updatedUser};
    });
  },
});
