/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = {};
fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf-8')
  .split('\n').forEach(line => {
    line = line.replace(/\r$/, '');
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
    if (m) {
      let v = (m[2] || '').trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      env[m[1]] = v;
    }
  });

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const svcKey = env.SUPABASE_SERVICE_ROLE_KEY;

(async () => {
  console.log('URL:', url);
  console.log('Using anon/publishable key:', anonKey ? anonKey.slice(0, 12) + '…' : 'MISSING');

  // 1. Try admin_login via anon
  const anon = createClient(url, anonKey);
  const { data: loginData, error: loginErr } = await anon.rpc('admin_login', {
    p_email: 'admin@sunopticsmf.com',
    p_password: 'SunOptics@2026',
  });
  console.log('\n[anon] admin_login:', loginErr ? `ERROR -> ${loginErr.message}` : loginData);

  // 2. Try anon booking insert
  const { data: services } = await anon.from('services').select('id').limit(1);
  const sid = services && services[0] ? services[0].id : null;
  const { data: bk, error: bkErr } = await anon.from('bookings').insert({
    first_name: 'Diag', last_name: 'Test',
    email: 'diag@test.com', phone: '0000000000',
    service_id: sid,
    booking_date: '2026-06-15', booking_time: '10:00:00',
    status: 'pending',
  }).select('id').single();
  console.log('\n[anon] bookings insert:', bkErr ? `ERROR -> ${bkErr.message}` : `OK id=${bk.id}`);
  if (bk && bk.id) {
    const svc = createClient(url, svcKey);
    await svc.from('bookings').delete().eq('id', bk.id);
    console.log('   (cleaned up test row)');
  }
})();
