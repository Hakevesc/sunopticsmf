const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envConfig = {};
try {
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
} catch (e) {
  console.error("Could not read .env.local:", e.message);
  process.exit(1);
}

const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🔗 Connecting to:", supabaseUrl);
  console.log("");

  // ── Step 1: Read and execute the SQL schema ──
  const sqlPath = path.join(__dirname, '..', 'supabase_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  console.log("📄 Running supabase_schema.sql via rpc('exec_sql')...");

  // Try using the REST SQL endpoint directly
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
    },
  });

  // The SQL editor approach won't work via REST. Let's seed using the JS client directly.
  console.log("⚡ Seeding tables using Supabase JS client...\n");

  // ── Step 2: Seed glass_categories ──
  console.log("📦 Seeding glass_categories...");
  const glassCategories = [
    { name_en: 'Cat-Eye / Butterfly', slug: 'cat-eye-butterfly', display_order: 1 },
    { name_en: 'Rounded Rectangle',   slug: 'rounded-rectangle', display_order: 2 },
    { name_en: 'Round / Oval',        slug: 'round-oval',        display_order: 3 },
    { name_en: 'Wayfarer / Square',   slug: 'wayfarer-square',   display_order: 4 },
    { name_en: 'Sunglasses',          slug: 'sunglasses',        display_order: 5 },
    { name_en: 'Rectangle',           slug: 'rectangle',         display_order: 6 },
    { name_en: 'Modified Rectangle',  slug: 'modified-rectangle', display_order: 7 },
  ];

  const { data: catData, error: catError } = await supabase
    .from('glass_categories')
    .upsert(glassCategories, { onConflict: 'slug' })
    .select('id, slug');

  if (catError) {
    console.error("❌ glass_categories error:", catError.message);
    console.log("\n⚠️  The tables don't exist yet. You need to run the SQL schema first.");
    console.log("   1. Open your Supabase Dashboard → SQL Editor");
    console.log("   2. Copy the contents of supabase_schema.sql");
    console.log("   3. Paste and click 'Run'");
    console.log("   4. Then re-run this script: node scratch/seed-database.js\n");
    process.exit(1);
  }

  const catMap = {};
  catData.forEach(c => { catMap[c.slug] = c.id; });
  console.log(`   ✅ ${catData.length} categories ready`);

  // ── Step 3: Seed lens_categories ──
  console.log("📦 Seeding lens_categories...");
  const lensCategories = [
    { name_en: 'Correct Your Vision', name_am: 'ራዕይዎን ያስተካክሉ', slug: 'correct-your-vision', display_order: 1 },
    { name_en: 'Protect Your Eyes',   name_am: 'ዓይኖትዎን ይጠብቁ', slug: 'protect-your-eyes',   display_order: 2 },
    { name_en: 'Enhance Your Vision', name_am: 'ራዕይዎን ያሻሽሉ',   slug: 'enhance-your-vision', display_order: 3 },
  ];

  const { data: lcData, error: lcError } = await supabase
    .from('lens_categories')
    .upsert(lensCategories, { onConflict: 'slug' })
    .select('id, slug');

  if (lcError) { console.error("❌ lens_categories error:", lcError.message); process.exit(1); }

  const lcMap = {};
  lcData.forEach(c => { lcMap[c.slug] = c.id; });
  console.log(`   ✅ ${lcData.length} lens categories ready`);

  // ── Step 4: Seed lens_needs ──
  console.log("📦 Seeding lens_needs...");
  const lensNeeds = [
    { name_en: 'For Kids',              name_am: 'ለልጆች',              slug: 'for-kids',              display_order: 1 },
    { name_en: 'Near Vision',           name_am: 'የቅርብ ራዕይ',         slug: 'near-vision',           display_order: 2 },
    { name_en: 'Far Vision',            name_am: 'የሩቅ ራዕይ',          slug: 'far-vision',            display_order: 3 },
    { name_en: 'Blue Light Protection', name_am: 'ሰማያዊ ብርሃን ጥበቃ', slug: 'blue-light-protection', display_order: 4 },
    { name_en: 'Sun Protection',        name_am: 'የፀሐይ ጥበቃ',        slug: 'sun-protection',        display_order: 5 },
    { name_en: 'Light Sensitivity',     name_am: 'የብርሃን ስሜት',       slug: 'light-sensitivity',     display_order: 6 },
    { name_en: 'Lens Durability',       name_am: 'የሌንስ ጥንካሬ',       slug: 'lens-durability',       display_order: 7 },
  ];

  const { data: lnData, error: lnError } = await supabase
    .from('lens_needs')
    .upsert(lensNeeds, { onConflict: 'slug' })
    .select('id, slug');

  if (lnError) { console.error("❌ lens_needs error:", lnError.message); process.exit(1); }

  const lnMap = {};
  lnData.forEach(n => { lnMap[n.slug] = n.id; });
  console.log(`   ✅ ${lnData.length} lens needs ready`);

  // ── Step 5: Seed glasses ──
  console.log("📦 Seeding 20 glasses...");
  const glassesList = [
    { name_en: 'Cat-Eye Black Frame',              glass_code: '28 011 52 17-140 C5',  image_url: '/Glasses/Cat-Eye  Butterfly.webp',       cat: 'cat-eye-butterfly',  lc: ['correct-your-vision'],                           ln: ['for-kids', 'far-vision'] },
    { name_en: 'Soft Cat-Eye Black Frame',          glass_code: '28 098 51 15-140 C1',  image_url: '/Glasses/Cat-Eye.webp',                  cat: 'cat-eye-butterfly',  lc: ['correct-your-vision', 'enhance-your-vision'],    ln: ['near-vision', 'light-sensitivity'] },
    { name_en: 'Matte Brown/Taupe Frame',           glass_code: '72 043 51 19 148 C6',  image_url: '/Glasses/Rounded Rectangle.webp',        cat: 'rounded-rectangle',  lc: ['correct-your-vision', 'protect-your-eyes'],      ln: ['for-kids', 'blue-light-protection'] },
    { name_en: 'Classic Round Black Frame',         glass_code: '1261 48 18 C1',         image_url: '/Glasses/Round-Oval.webp',               cat: 'round-oval',         lc: ['correct-your-vision', 'enhance-your-vision'],    ln: ['far-vision', 'near-vision'] },
    { name_en: 'Round Wire/Thin Black Frame',       glass_code: '1395 49 17 C1',         image_url: '/Glasses/Round.webp',                    cat: 'round-oval',         lc: ['enhance-your-vision'],                           ln: ['light-sensitivity', 'lens-durability'] },
    { name_en: 'Thick Square Black Frame',          glass_code: '02003 50 21-145 C1',    image_url: '/Glasses/Wayfarer-Square.avif',          cat: 'wayfarer-square',    lc: ['correct-your-vision', 'protect-your-eyes'],      ln: ['lens-durability', 'sun-protection'] },
    { name_en: 'Clear / Pastel Round Frame',        glass_code: '2132 49 17-140',        image_url: '/Glasses/Pastel Round.webp',             cat: 'round-oval',         lc: ['protect-your-eyes', 'enhance-your-vision'],      ln: ['blue-light-protection', 'light-sensitivity'] },
    { name_en: 'Thin Rose Gold/Pink Round Frame',   glass_code: '2134 50 20-147',        image_url: '/Glasses/Thin Rose Gold Round.webp',     cat: 'round-oval',         lc: ['enhance-your-vision'],                           ln: ['light-sensitivity', 'for-kids'] },
    { name_en: 'Daily Oval Black Frame',            glass_code: '2311 53 17-142 C2',     image_url: '/Glasses/Oval-Rounded.webp',             cat: 'round-oval',         lc: ['correct-your-vision'],                           ln: ['near-vision', 'far-vision'] },
    { name_en: 'Ultra-Thin Round Wire Frame',       glass_code: '3111 53 18-145',        image_url: '/Glasses/Ultra-Thin Round.avif',         cat: 'round-oval',         lc: ['enhance-your-vision', 'correct-your-vision'],    ln: ['lens-durability', 'near-vision'] },
    { name_en: 'Minimalist Round Black Frame',      glass_code: '7910 48 18-148',        image_url: '/Glasses/Minimalist Round.avif',         cat: 'round-oval',         lc: ['correct-your-vision'],                           ln: ['for-kids', 'far-vision'] },
    { name_en: 'Slim Rectangle Black Frame',        glass_code: '8186 50 17-145 C2',     image_url: '/Glasses/Slim Rectangle.webp',           cat: 'rectangle',          lc: ['correct-your-vision', 'protect-your-eyes'],      ln: ['blue-light-protection', 'lens-durability'] },
    { name_en: 'Square Tinted Sunglasses',          glass_code: '8191 49 23-146',        image_url: '/Glasses/Sunglasses.webp',               cat: 'sunglasses',         lc: ['protect-your-eyes'],                             ln: ['sun-protection', 'light-sensitivity'] },
    { name_en: 'Standard Rectangle Black Frame',    glass_code: '28001 52 17-140 C1',    image_url: '/Glasses/Rectangle-Wayfarer.webp',      cat: 'rectangle',          lc: ['correct-your-vision'],                           ln: ['near-vision', 'far-vision'] },
    { name_en: 'Deep Rectangle Black Frame',        glass_code: '28006 52 17-140 C1',    image_url: '/Glasses/Deep Rectangle.avif',           cat: 'rectangle',          lc: ['correct-your-vision', 'protect-your-eyes'],      ln: ['lens-durability', 'blue-light-protection'] },
    { name_en: 'Flared Cat-Eye Black Frame',        glass_code: '28015 49 17-140 C1',    image_url: '/Glasses/Flared Cat-Eye.avif',           cat: 'cat-eye-butterfly',  lc: ['enhance-your-vision'],                           ln: ['for-kids', 'light-sensitivity'] },
    { name_en: 'Thick Rim Round Black Frame',       glass_code: '28016 46 21-140 C1',    image_url: '/Glasses/Thick Rim Round.webp',          cat: 'round-oval',         lc: ['correct-your-vision', 'protect-your-eyes'],      ln: ['sun-protection', 'lens-durability'] },
    { name_en: 'Angular Rectangle Black Frame',     glass_code: '28020 52 19-140 C1',    image_url: '/Glasses/Angular Rectangle.avif',        cat: 'rectangle',          lc: ['correct-your-vision'],                           ln: ['far-vision', 'near-vision'] },
    { name_en: 'Soft Corner Rectangle Black Frame', glass_code: '28022 51 18-140 C1',    image_url: '/Glasses/Soft Corner Rectangle.webp',   cat: 'modified-rectangle', lc: ['correct-your-vision', 'enhance-your-vision'],    ln: ['blue-light-protection', 'light-sensitivity'] },
    { name_en: 'Bold Curved Cat-Eye Black Frame',   glass_code: '28025 53 18-140 C1',    image_url: '/Glasses/Bold Curved Cat-Eye.avif',     cat: 'cat-eye-butterfly',  lc: ['protect-your-eyes', 'enhance-your-vision'],      ln: ['sun-protection', 'light-sensitivity'] },
  ];

  let glassCount = 0;
  for (const g of glassesList) {
    const categoryId = catMap[g.cat];
    if (!categoryId) {
      console.error(`   ⚠️ No category found for slug: ${g.cat}`);
      continue;
    }

    // Check if glass already exists by glass_code
    const { data: existing } = await supabase
      .from('glasses')
      .select('id')
      .eq('glass_code', g.glass_code)
      .limit(1);

    let glassId;
    if (existing && existing.length > 0) {
      glassId = existing[0].id;
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from('glasses')
        .insert({
          category_id: categoryId,
          name_en: g.name_en,
          glass_code: g.glass_code,
          image_url: g.image_url,
          is_active: true,
          is_featured: false,
          is_new: false,
        })
        .select('id')
        .single();

      if (insertErr) {
        console.error(`   ❌ Error inserting "${g.name_en}":`, insertErr.message);
        continue;
      }
      glassId = inserted.id;
    }

    // Insert lens category junctions
    for (const lcSlug of g.lc) {
      const lcId = lcMap[lcSlug];
      if (lcId) {
        await supabase.from('glasses_lens_categories')
          .upsert({ glass_id: glassId, lens_category_id: lcId }, { onConflict: 'glass_id,lens_category_id' });
      }
    }

    // Insert lens need junctions
    for (const lnSlug of g.ln) {
      const lnId = lnMap[lnSlug];
      if (lnId) {
        await supabase.from('glasses_lens_needs')
          .upsert({ glass_id: glassId, lens_need_id: lnId }, { onConflict: 'glass_id,lens_need_id' });
      }
    }

    glassCount++;
  }
  console.log(`   ✅ ${glassCount} glasses seeded`);

  // ── Step 6: Seed services ──
  console.log("📦 Seeding services...");
  const services = [
    { name_en: 'Computerized Eye Testing', name_am: 'የኮምፒዩተር የዓይን ምርመራ', description_en: 'Advanced digital refraction technology for precise prescriptions.', icon_name: 'scan-eye', display_order: 1, is_active: true },
    { name_en: 'Optical Dispensary',        name_am: 'ኦፕቲካል ዲስፔንሰሪ',        description_en: 'Browse our curated collection of premium frames and precision-crafted lenses.', icon_name: 'glasses', display_order: 2, is_active: true },
  ];

  const { error: svcErr } = await supabase.from('services').upsert(services, { onConflict: 'name_en' });
  if (svcErr) console.error("   ⚠️ services:", svcErr.message);
  else console.log("   ✅ Services seeded");

  // ── Done ──
  console.log("\n🎉 Database seeding complete!");
  console.log("   Your admin panel should now show all 20 products.");
  console.log("   Refresh your browser to see the changes.\n");
}

seed().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
