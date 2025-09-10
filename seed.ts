import dotenv from 'dotenv';
import { supabase } from './src/lib/supabase';
import { generateDemoProducts } from './src/utils/demoProducts';
import { generateDemoAdminSettings } from './src/utils/demoAdminSettings';
import { generateDemoHeroBannerContent } from './src/utils/demoHeroBannerContent';
import { seedDemoOrders } from './src/utils/demoOrders';

// Load environment variables from .env
dotenv.config();

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Clear existing data (optional, for development purposes)
    console.log('Clearing existing data...');
    await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('products').delete().neq('id', 0);
    await supabase.from('admin_settings').delete();
    await supabase.from('hero_banner_content').delete();
    console.log('Existing data cleared.');

    // 1. Seed Products
    console.log('Seeding products...');
    const demoProducts = generateDemoProducts(20);
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .insert(demoProducts)
      .select();

    if (productsError) {
      console.error('Error seeding products:', productsError);
      return;
    }
    console.log(`Seeded ${productsData.length} products.`);

    // 2. Seed Admin Settings
    console.log('Seeding admin settings...');
    const demoAdminSettings = { ...generateDemoAdminSettings(), id: '1' };
    const { error: adminSettingsError } = await supabase
      .from('admin_settings')
      .upsert([demoAdminSettings]);

    if (adminSettingsError) {
      console.error('Error seeding admin settings:', adminSettingsError);
      return;
    }
    console.log('Admin settings seeded.');

    // 3. Seed Hero Banner Content
    console.log('Seeding hero banner content...');
    const demoHeroBannerContent = { ...generateDemoHeroBannerContent(), id: '1' };
    const { error: heroBannerError } = await supabase
      .from('hero_banner_content')
      .upsert([demoHeroBannerContent]);

    if (heroBannerError) {
      console.error('Error seeding hero banner content:', heroBannerError);
      return;
    }
    console.log('Hero banner content seeded.');

    // 4. Seed Orders (requires products and a dummy wallet address)
    console.log('Seeding demo orders...');
    const dummyWalletAddress = '0x1234567890abcdef1234567890abcdef12345678'; // Replace with a real user's wallet if needed
    await seedDemoOrders(10, dummyWalletAddress, productsData);
    console.log('Demo orders seeded.');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('An unexpected error occurred during seeding:', error);
  } finally {
    // In a real application, you might want to close the Supabase client connection if it's not managed globally.
    // For this setup, the client is a singleton, so no explicit close is needed.
  }
}

seedDatabase();
