import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Order, CartItem, ShippingAddress } from '../types';

export const useOrders = (walletAddress?: string) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (walletAddress) {
        query = query.eq('user_wallet', walletAddress.toString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedOrders: Order[] = data.map(order => ({
        id: order.id,
        items: order.items,
        shippingAddress: order.shipping_address,
        subtotal: order.subtotal,
        shippingCost: order.shipping_cost,
        total: order.total,
        status: order.status,
        walletAddress: order.user_wallet,
        createdAt: new Date(order.created_at),
        trackingNumber: order.tracking_number
      }));

      setOrders(formattedOrders);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (
    items: CartItem[],
    shippingAddress: ShippingAddress,
    total: number,
    walletAddress: string
  ) => {
    try {
      const newOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        user_wallet: walletAddress,
        items: items,
        shipping_address: shippingAddress,
        subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        shipping_cost: total - items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        total: total,
        status: 'pending' as const
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();

      if (error) throw error;

      const formattedOrder: Order = {
        id: data.id,
        items: data.items,
        shippingAddress: data.shipping_address,
        subtotal: data.subtotal,
        shippingCost: data.shipping_cost,
        total: data.total,
        status: data.status,
        walletAddress: data.user_wallet,
        createdAt: new Date(data.created_at),
        trackingNumber: data.tracking_number
      };

      setOrders(prev => [formattedOrder, ...prev]);
      return formattedOrder;
    } catch (err) {
      console.error('Error creating order:', err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      throw err;
    }
  };

  useEffect(() => {
    loadOrders();
  }, [walletAddress]);

  return {
    orders,
    loading,
    error,
    loadOrders,
    createOrder,
    updateOrderStatus
  };
};
