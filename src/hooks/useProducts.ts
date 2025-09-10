import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  const updateProduct = async (id: number, product: Omit<Product, 'id'>) => {
    try {
      console.log('useProducts: Sending update to Supabase for ID:', id, 'with data:', product);
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select();

      if (error) {
        console.error('useProducts: Supabase update error:', error);
        throw error;
      }

      console.log('useProducts: Supabase update response (data):', data);

      // Update local state with the data returned from Supabase
      setProducts(prev =>
        prev.map(p => {
          // Check if data exists and contains the updated product
          const updatedItem = data && data.length > 0 ? data[0] : null;
          return p.id === id && updatedItem ? updatedItem : p;
        })
      );
      console.log('Product updated successfully in local state.');
      
      // Force re-fetch all products to ensure consistency with DB
      await loadProducts(); 

    } catch (err) {
      console.error('Error updating product:', err);
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    }
  };

  const bulkAddProducts = async (products: Omit<Product, 'id'>[]) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert(products)
        .select();

      if (error) throw error;

      setProducts(prev => [...prev, ...data]);
      return data;
    } catch (err) {
      console.error('Error bulk adding products:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    bulkAddProducts
  };
};
