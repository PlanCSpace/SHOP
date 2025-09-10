import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Checking Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NOT FOUND');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.log('\n📝 Your .env file should contain:');
  console.log('VITE_SUPABASE_URL=your_supabase_url');
  console.log('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n🔗 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('products')
      .select('count(*)')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      
      if (error.message.includes('relation "products" does not exist')) {
        console.log('\n💡 The products table does not exist. Running migrations might help.');
        console.log('Try running: npm run seed');
      }
      
      return false;
    }

    console.log('✅ Database connection successful!');
    console.log('📊 Products table accessible');
    
    // Test other tables
    const tables = ['orders', 'admin_settings', 'hero_banner_content', 'categories'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('count(*)')
          .limit(1);
          
        if (tableError) {
          console.log(`⚠️  Table "${table}" not accessible: ${tableError.message}`);
        } else {
          console.log(`✅ Table "${table}" accessible`);
        }
      } catch (err) {
        console.log(`⚠️  Table "${table}" check failed: ${err.message}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

async function checkAuth() {
  try {
    console.log('\n🔐 Testing authentication...');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log('ℹ️  No authenticated user (this is normal for anon key)');
    } else {
      console.log('✅ User authenticated:', user?.email || 'Anonymous');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Auth test failed:', error.message);
    return false;
  }
}

async function main() {
  const connectionOk = await testConnection();
  await checkAuth();
  
  if (connectionOk) {
    console.log('\n🎉 Supabase connection is working correctly!');
    console.log('\n📝 Next steps:');
    console.log('1. Run: npm run seed (to populate database with demo data)');
    console.log('2. Run: npm run dev (to start the development server)');
  } else {
    console.log('\n❌ Connection issues detected. Please check:');
    console.log('1. Your .env file contains correct Supabase credentials');
    console.log('2. Your Supabase project is active');
    console.log('3. Database tables exist (run migrations if needed)');
  }
}

main().catch(console.error);
