/**
 * Push sample booking data to Supabase.
 * Run: node scratch/push-sample-bookings.js
 */
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://sibxvfszhopnpvnaoiha.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpYnh2ZnN6aG9wbnB2bmFvaWhhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTcyODY3NywiZXhwIjoyMDk1MzA0Njc3fQ.T6t7hv5_tWqwI_T5AAbVi2SKm4Ye6dbeSjJPWti9Bbc'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleBookings = [
  {
    first_name: 'Abebe',
    last_name: 'Kebede',
    email: 'abebe.kebede@example.com',
    phone: '0911 234 567',
    address: 'Bole, Addis Ababa',
    booking_date: '2026-06-01',
    booking_time: '09:00:00',
    reason: 'Annual eye checkup',
    special_requests: 'Prefer morning appointment',
    status: 'pending',
  },
  {
    first_name: 'Sara',
    last_name: 'Mohammed',
    email: 'sara.mohammed@example.com',
    phone: '0922 345 678',
    address: 'Kazanchis, Addis Ababa',
    booking_date: '2026-06-01',
    booking_time: '10:30:00',
    reason: 'New prescription needed',
    special_requests: null,
    status: 'confirmed',
  },
  {
    first_name: 'Dawit',
    last_name: 'Tesfaye',
    email: 'dawit.tesfaye@example.com',
    phone: '0933 456 789',
    address: 'Meskel Flower, Addis Ababa',
    booking_date: '2026-06-02',
    booking_time: '14:00:00',
    reason: 'Frame fitting and lens consultation',
    special_requests: 'Interested in blue light blocking lenses',
    status: 'pending',
  },
  {
    first_name: 'Hiwot',
    last_name: 'Getachew',
    email: 'hiwot.getachew@example.com',
    phone: '0944 567 890',
    address: 'CMC, Addis Ababa',
    booking_date: '2026-06-02',
    booking_time: '11:00:00',
    reason: 'Computer vision syndrome consultation',
    special_requests: null,
    status: 'confirmed',
  },
  {
    first_name: 'Yonas',
    last_name: 'Alemayehu',
    email: 'yonas.alemayehu@example.com',
    phone: '0955 678 901',
    address: 'Sarbet, Addis Ababa',
    booking_date: '2026-06-03',
    booking_time: '15:30:00',
    reason: 'Children eye checkup',
    special_requests: 'Booking for my 8-year-old son',
    status: 'pending',
  },
]

async function pushSampleBookings() {
  console.log('Pushing sample bookings...')

  const { data, error } = await supabase
    .from('bookings')
    .insert(sampleBookings)
    .select()

  if (error) {
    console.error('Error inserting bookings:', error.message)
    process.exit(1)
  }

  console.log(`✓ Successfully inserted ${data.length} sample bookings:`)
  data.forEach((b) => {
    console.log(`  - ${b.first_name} ${b.last_name} | ${b.booking_date} ${b.booking_time} | Status: ${b.status}`)
  })
}

pushSampleBookings()