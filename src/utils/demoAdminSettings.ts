import { faker } from '@faker-js/faker';
import { AdminSettings } from '../types';

export const generateDemoAdminSettings = (): Omit<AdminSettings, 'id' | 'updated_at'> => {
  return {
    shipping_cost: 25,
    free_shipping_threshold: 500
  };
};
