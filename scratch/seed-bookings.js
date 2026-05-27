/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
const envConfig = {};
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  line = line.replace(/\r$/, '');
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
  if (match) {
    let value = (match[2] || '').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    envConfig[match[1]] = value;
  }
});

const url = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const key = envConfig.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(url, key);

(async () => {
  console.log('Connecting to', url);

  // 1) Verify the bookings table exists by counting rows
  const { count, error: countError } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    console.error('Could not read bookings table:', countError.message);
    process.exit(1);
  }
  console.log(`Bookings table reachable. Current row count: ${count}`);

  // 2) Look up service IDs (so bookings link to real services)
  const { data: services } = await supabase
    .from('services')
    .select('id, name_en')
    .eq('is_active', true);

  const findService = (needle) =>
    services?.find(s => s.name_en.toLowerCase().includes(needle))?.id || null;

  const eyeTest = findService('eye testing') || findService('computerized');
  const optical = findService('optical');

  console.log('Service IDs:', { eyeTest, optical });

  // 3) Build sample bookings spread across recent + upcoming dates and statuses
  const today = new Date();
  const dayOffset = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  };

  const samples = [
    { first_name: 'Abebe',   last_name: 'Kebede',     email: 'abebe.kebede@email.com',     phone: '0911 234 567', address: 'Bole, Addis Ababa',         service_id: eyeTest, booking_date: dayOffset(1),  booking_time: '09:00:00', reason: 'Routine eye exam',           special_requests: 'Prefer morning slot',                          status: 'pending'   },
    { first_name: 'Sara',    last_name: 'Mohammed',   email: 'sara.mohammed@email.com',    phone: '0922 345 678', address: 'Kazanchis, Addis Ababa',    service_id: optical, booking_date: dayOffset(1),  booking_time: '10:30:00', reason: 'New frames consultation',    special_requests: null,                                            status: 'confirmed' },
    { first_name: 'Dawit',   last_name: 'Tesfaye',    email: 'dawit.tesfaye@email.com',    phone: '0933 456 789', address: 'Piassa, Addis Ababa',       service_id: eyeTest, booking_date: dayOffset(2),  booking_time: '14:00:00', reason: 'Blurry vision',              special_requests: 'Bring previous prescription',                  status: 'pending'   },
    { first_name: 'Hanna',   last_name: 'Girma',      email: 'hanna.girma@email.com',      phone: '0944 567 890', address: 'CMC, Addis Ababa',          service_id: optical, booking_date: dayOffset(3),  booking_time: '11:00:00', reason: 'Sunglasses fitting',         special_requests: 'Interested in Cat-Eye styles',                 status: 'confirmed' },
    { first_name: 'Yonas',   last_name: 'Bekele',     email: 'yonas.bekele@email.com',     phone: '0955 678 901', address: 'Megenagna, Addis Ababa',    service_id: eyeTest, booking_date: dayOffset(4),  booking_time: '15:30:00', reason: 'Annual check-up',            special_requests: null,                                            status: 'pending'   },
    { first_name: 'Meron',   last_name: 'Haile',      email: 'meron.haile@email.com',      phone: '0966 789 012', address: 'Sarbet, Addis Ababa',       service_id: optical, booking_date: dayOffset(5),  booking_time: '09:30:00', reason: 'Blue light glasses',         special_requests: 'Works on screen all day',                       status: 'pending'   },
    { first_name: 'Tewodros',last_name: 'Asfaw',      email: 'tewodros.asfaw@email.com',   phone: '0977 890 123', address: 'Lebu, Addis Ababa',         service_id: eyeTest, booking_date: dayOffset(-2), booking_time: '08:30:00', reason: 'Eye strain headaches',       special_requests: null,                                            status: 'completed' },
    { first_name: 'Rahel',   last_name: 'Worku',      email: 'rahel.worku@email.com',      phone: '0988 901 234', address: 'Gerji, Addis Ababa',        service_id: optical, booking_date: dayOffset(-5), booking_time: '13:00:00', reason: 'Frame replacement',          special_requests: null,                                            status: 'completed' },
    { first_name: 'Kalkidan',last_name: 'Solomon',    email: 'kalkidan.solomon@email.com', phone: '0911 102 030', address: 'Saris, Addis Ababa',        service_id: eyeTest, booking_date: dayOffset(-1), booking_time: '16:00:00', reason: 'Contact lens consult',       special_requests: null,                                            status: 'cancelled' },
    { first_name: 'Eyob',    last_name: 'Mengistu',   email: 'eyob.mengistu@email.com',    phone: '0922 203 040', address: 'Mexico, Addis Ababa',       service_id: optical, booking_date: dayOffset(7),  booking_time: '12:00:00', reason: 'Kids glasses fitting',       special_requests: 'Appointment for 8 year old daughter',          status: 'confirmed' },
    { first_name: 'Bethel',  last_name: 'Alemu',      email: 'bethel.alemu@email.com',     phone: '0933 304 050', address: 'Goro, Addis Ababa',         service_id: eyeTest, booking_date: dayOffset(8),  booking_time: '10:00:00', reason: 'Prescription update',        special_requests: 'Reading glasses needed',                       status: 'pending'   },
    { first_name: 'Nahom',   last_name: 'Tadesse',    email: 'nahom.tadesse@email.com',    phone: '0944 405 060', address: 'Ayat, Addis Ababa',         service_id: optical, booking_date: dayOffset(10), booking_time: '14:30:00', reason: 'Premium frame collection',   special_requests: 'Looking for luxury options',                   status: 'pending'   },
  ];

  const { data: inserted, error: insertError } = await supabase
    .from('bookings')
    .insert(samples)
    .select('id, first_name, last_name, booking_date, status');

  if (insertError) {
    console.error('Insert failed:', insertError.message);
    process.exit(1);
  }

  console.log(`Inserted ${inserted.length} sample bookings:`);
  inserted.forEach(b => {
    console.log(`  - ${b.first_name} ${b.last_name}  ${b.booking_date}  [${b.status}]`);
  });

  const { count: finalCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true });
  console.log(`\nFinal bookings row count: ${finalCount}`);
})();
