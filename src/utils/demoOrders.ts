import { faker } from '@faker-js/faker';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export const seedDemoOrders = async (count: number, userId: string, products: Product[]) => {
  if (!products || products.length === 0) {
    console.warn('No products available to create orders. Skipping order seeding.');
    return;
  }

  console.log(`Seeding ${count} demo orders for user ${userId}...`);
  const orders = [];

  for (let i = 0; i < count; i++) {
    const numberOfItems = faker.number.int({ min: 1, max: 3 });
    const orderItems = [];
    let totalAmount = 0;

    for (let j = 0; j < numberOfItems; j++) {
      const product = faker.helpers.arrayElement(products);
      const quantity = faker.number.int({ min: 1, max: 5 });
      const itemPrice = product.price * quantity;
      totalAmount += itemPrice;

      orderItems.push({
        product_id: product.id,
        quantity: quantity,
        price_at_purchase: product.price,
      });
    }

    orders.push({
      user_id: userId,
      total_amount: parseFloat(totalAmount.toFixed(2)),
      status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
      shipping_address: faker.location.streetAddress(true),
      payment_method: faker.helpers.arrayElement(['credit_card', 'paypal', 'crypto']),
      order_items: orderItems, // Store as JSONB
      created_at: faker.date.past({ years: 1 }).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  const { error } = await supabase.from('orders').insert(orders);

  if (error) {
    console.error('Error seeding orders:', error);
  } else {
    console.log(`Seeded ${orders.length} orders.`);
  }
};
