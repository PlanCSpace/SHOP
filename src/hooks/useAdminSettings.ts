import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AdminSettings } from '../types';

export const useAdminSettings = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    shipping_cost: 25,
    free_shipping_threshold: 500
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSettings({
          shipping_cost: data.shipping_cost,
          free_shipping_threshold: data.free_shipping_threshold
        });
      }
    } catch (err) {
      console.error('Error loading admin settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: AdminSettings) => {
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          id: '1',
          shipping_cost: newSettings.shipping_cost,
          free_shipping_threshold: newSettings.free_shipping_threshold
        });

      if (error) throw error;

      setSettings(newSettings);
    } catch (err) {
      console.error('Error updating admin settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    loadSettings,
    updateSettings
  };
};
