const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually to avoid depending on dotenv
const envPath = path.join(__dirname, '..', '.env.local');
const envConfig = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.substring(1, value.length - 1);
      }
      envConfig[key] = value.trim();
    }
  });
} catch (e) {
  console.error("Could not read .env.local manually:", e.message);
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || envConfig.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local", { supabaseUrl, supabaseKey });
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase connection to:", supabaseUrl);
  
  const tables = ['services', 'staff', 'glass_categories', 'lens_categories', 'lens_needs', 'glasses', 'bookings'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.log(`❌ Table "${table}": Error -`, error.message);
      } else {
        console.log(`✅ Table "${table}": Exists! Record count in query:`, data.length);
      }
    } catch (err) {
      console.log(`❌ Table "${table}": Query failed -`, err.message);
    }
  }
}

testConnection();
