/**
 * Subscription Slice
 * Manages premium subscription state
 */

import {StateCreator} from 'zustand';
import {storageService} from '@services/storage';
import {STORAGE_KEYS} from '@constants';

export type SubscriptionType = 'monthly' | 'yearly' | 'lifetime' | null;

export interface SubscriptionSlice {
  isPremium: boolean;
  subscriptionType: SubscriptionType;
  subscriptionEndDate: Date | null;
  isLoading: boolean;

  // Actions
  setPremiumStatus: (
    isPremium: boolean,
    type?: SubscriptionType,
    endDate?: Date
  ) => void;
  restorePurchase: () => Promise<void>;
  checkSubscription: () => Promise<void>;
  loadSubscriptionFromStorage: () => void;
}

export const createSubscriptionSlice: StateCreator<SubscriptionSlice> = (
  set
) => ({
  isPremium: false,
  subscriptionType: null,
  subscriptionEndDate: null,
  isLoading: false,

  setPremiumStatus: (isPremium, type, endDate) => {
    const subscriptionData = {
      isPremium,
      subscriptionType: type || null,
      subscriptionEndDate: endDate || null,
    };

    set(subscriptionData);

    // Persist to storage
    storageService.setObject(STORAGE_KEYS.subscriptionStatus, subscriptionData);
    storageService.setBoolean(STORAGE_KEYS.isPremium, isPremium);
  },

  restorePurchase: async () => {
    set({isLoading: true});
    try {
      // TODO: Implement IAP restore logic
      // This will be implemented in Phase 21 with react-native-iap

      console.log('Restoring purchase...');
      // Simulate restoration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      set({isLoading: false});
    } catch (error) {
      console.error('Failed to restore purchase:', error);
      set({isLoading: false});
      throw error;
    }
  },

  checkSubscription: async () => {
    set({isLoading: true});
    try {
      // TODO: Implement IAP subscription check
      // This will be implemented in Phase 21

      console.log('Checking subscription status...');
      await new Promise((resolve) => setTimeout(resolve, 500));

      set({isLoading: false});
    } catch (error) {
      console.error('Failed to check subscription:', error);
      set({isLoading: false});
    }
  },

  loadSubscriptionFromStorage: () => {
    const savedSubscription = storageService.getObject<{
      isPremium: boolean;
      subscriptionType: SubscriptionType;
      subscriptionEndDate: Date | null;
    }>(STORAGE_KEYS.subscriptionStatus);

    if (savedSubscription) {
      set({
        isPremium: savedSubscription.isPremium || false,
        subscriptionType: savedSubscription.subscriptionType || null,
        subscriptionEndDate: savedSubscription.subscriptionEndDate
          ? new Date(savedSubscription.subscriptionEndDate)
          : null,
      });
    }
  },
});
