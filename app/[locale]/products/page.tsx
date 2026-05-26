'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/products/GlassCard'

// ─── Lens Category Data (Top-Level Filter: Correct / Protect / Enhance) ───
const lensCategories = [
  { id: 'all', name_en: 'All', name_am: 'ሁሉም' },
  { id: 'correct-your-vision', name_en: 'Correct Your Vision', name_am: 'ራዕይዎን ያስተካክሉ' },
  { id: 'protect-your-eyes',   name_en: 'Protect Your Eyes',   name_am: 'ዓይኖትዎን ይጠብቁ' },
  { id: 'enhance-your-vision', name_en: 'Enhance Your Vision', name_am: 'ራዕይዎን ያሻሽሉ' },
]

// ─── Needs Data (Specific Use-Case Filter) ───
const lensNeeds = [
  { id: 'all',             name_en: 'All',                    name_am: 'ሁሉም' },
  { id: 'for-kids',        name_en: 'For Kids',               name_am: 'ለልጆች' },
  { id: 'near-vision',     name_en: 'Near Vision',            name_am: 'የቅርብ ራዕይ' },
  { id: 'far-vision',      name_en: 'Far Vision',             name_am: 'የሩቅ ራዕይ' },
  { id: 'blue-light-protection', name_en: 'Blue Light Protection', name_am: 'ሰማያዊ ብርሃን ጥበቃ' },
  { id: 'sun-protection',  name_en: 'Sun Protection',         name_am: 'የፀሐይ ጥበቃ' },
  { id: 'light-sensitivity', name_en: 'Light Sensitivity',    name_am: 'የብርሃን ስሜት' },
  { id: 'lens-durability', name_en: 'Lens Durability',       name_am: 'የሌንስ ጥንካሬ' },
]

// ─── Existing Frame Shape Categories ───
const categories = [
  { id: 'all', name_en: 'All Frames' },
  { id: 'cat-eye-butterfly', name_en: 'Cat-Eye / Butterfly' },
  { id: 'rounded-rectangle', name_en: 'Rounded Rectangle' },
  { id: 'round-oval', name_en: 'Round / Oval' },
  { id: 'wayfarer-square', name_en: 'Wayfarer / Square' },
  { id: 'sunglasses', name_en: 'Sunglasses' },
  { id: 'rectangle', name_en: 'Rectangle' },
  { id: 'modified-rectangle', name_en: 'Modified Rectangle' },
]

// ─── Glasses Data (with lens category & need associations) ───
const glasses = [
  { id: '1',  name_en: 'Cat-Eye Black Frame',            glass_code: '28 011 52 17-140 C5', image_url: '/Glasses/Cat-Eye  Butterfly.webp', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['for-kids', 'far-vision'] },
  { id: '2',  name_en: 'Soft Cat-Eye Black Frame',        glass_code: '28 098 51 15-140 C1', image_url: '/Glasses/Cat-Eye.webp', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['correct-your-vision', 'enhance-your-vision'], lens_need_slugs: ['near-vision', 'light-sensitivity'] },
  { id: '3',  name_en: 'Matte Brown/Taupe Frame',         glass_code: '72 043 51 19 148 C6', image_url: '/Glasses/Rounded Rectangle.webp', category_slug: 'rounded-rectangle', glass_categories: { name_en: 'Rounded Rectangle' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['for-kids', 'blue-light-protection'] },
  { id: '4',  name_en: 'Classic Round Black Frame',       glass_code: '1261 48 18 C1', image_url: '/Glasses/Round-Oval.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision', 'enhance-your-vision'], lens_need_slugs: ['far-vision', 'near-vision'] },
  { id: '5',  name_en: 'Round Wire/Thin Black Frame',     glass_code: '1395 49 17 C1', image_url: '/Glasses/Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['enhance-your-vision'], lens_need_slugs: ['light-sensitivity', 'lens-durability'] },
  { id: '6',  name_en: 'Thick Square Black Frame',        glass_code: '02003 50 21-145 C1', image_url: '/Glasses/Wayfarer-Square.avif', category_slug: 'wayfarer-square', glass_categories: { name_en: 'Wayfarer / Square' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['lens-durability', 'sun-protection'] },
  { id: '7',  name_en: 'Clear / Pastel Round Frame',      glass_code: '2132 49 17-140', image_url: '/Glasses/Pastel Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['protect-your-eyes', 'enhance-your-vision'], lens_need_slugs: ['blue-light-protection', 'light-sensitivity'] },
  { id: '8',  name_en: 'Thin Rose Gold/Pink Round Frame', glass_code: '2134 50 20-147', image_url: '/Glasses/Thin Rose Gold Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['enhance-your-vision'], lens_need_slugs: ['light-sensitivity', 'for-kids'] },
  { id: '9',  name_en: 'Daily Oval Black Frame',           glass_code: '2311 53 17-142 C2', image_url: '/Glasses/Oval-Rounded.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['near-vision', 'far-vision'] },
  { id: '10', name_en: 'Ultra-Thin Round Wire Frame',     glass_code: '3111 53 18-145', image_url: '/Glasses/Ultra-Thin Round.avif', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['enhance-your-vision', 'correct-your-vision'], lens_need_slugs: ['lens-durability', 'near-vision'] },
  { id: '11', name_en: 'Minimalist Round Black Frame',    glass_code: '7910 48 18-148', image_url: '/Glasses/Minimalist Round.avif', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['for-kids', 'far-vision'] },
  { id: '12', name_en: 'Slim Rectangle Black Frame',       glass_code: '8186 50 17-145 C2', image_url: '/Glasses/Slim Rectangle.webp', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['blue-light-protection', 'lens-durability'] },
  { id: '13', name_en: 'Square Tinted Sunglasses',         glass_code: '8191 49 23-146', image_url: '/Glasses/Sunglasses.webp', category_slug: 'sunglasses', glass_categories: { name_en: 'Sunglasses' }, lens_category_slugs: ['protect-your-eyes'], lens_need_slugs: ['sun-protection', 'light-sensitivity'] },
  { id: '14', name_en: 'Standard Rectangle Black Frame',   glass_code: '28001 52 17-140 C1', image_url: '/Glasses/Rectangle-Wayfarer.webp', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['near-vision', 'far-vision'] },
  { id: '15', name_en: 'Deep Rectangle Black Frame',       glass_code: '28006 52 17-140 C1', image_url: '/Glasses/Deep Rectangle.avif', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['lens-durability', 'blue-light-protection'] },
  { id: '16', name_en: 'Flared Cat-Eye Black Frame',       glass_code: '28015 49 17-140 C1', image_url: '/Glasses/Flared Cat-Eye.avif', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['enhance-your-vision'], lens_need_slugs: ['for-kids', 'light-sensitivity'] },
  { id: '17', name_en: 'Thick Rim Round Black Frame',      glass_code: '28016 46 21-140 C1', image_url: '/Glasses/Thick Rim Round.webp', category_slug: 'round-oval', glass_categories: { name_en: 'Round / Oval' }, lens_category_slugs: ['correct-your-vision', 'protect-your-eyes'], lens_need_slugs: ['sun-protection', 'lens-durability'] },
  { id: '18', name_en: 'Angular Rectangle Black Frame',    glass_code: '28020 52 19-140 C1', image_url: '/Glasses/Angular Rectangle.avif', category_slug: 'rectangle', glass_categories: { name_en: 'Rectangle' }, lens_category_slugs: ['correct-your-vision'], lens_need_slugs: ['far-vision', 'near-vision'] },
  { id: '19', name_en: 'Soft Corner Rectangle Black Frame', glass_code: '28022 51 18-140 C1', image_url: '/Glasses/Soft Corner Rectangle.webp', category_slug: 'modified-rectangle', glass_categories: { name_en: 'Modified Rectangle' }, lens_category_slugs: ['correct-your-vision', 'enhance-your-vision'], lens_need_slugs: ['blue-light-protection', 'light-sensitivity'] },
  { id: '20', name_en: 'Bold Curved Cat-Eye Black Frame',  glass_code: '28025 53 18-140 C1', image_url: '/Glasses/Bold Curved Cat-Eye.avif', category_slug: 'cat-eye-butterfly', glass_categories: { name_en: 'Cat-Eye / Butterfly' }, lens_category_slugs: ['protect-your-eyes', 'enhance-your-vision'], lens_need_slugs: ['sun-protection', 'light-sensitivity'] },
]

function AccordionSection({
  title,
  defaultOpen,
  children,
}: {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-[0.12em] text-gray-400 mb-1 hover:text-gray-600 transition-colors"
      >
        {title}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="space-y-1 pb-2">
          {children}
        </div>
      </div>
    </div>
  )
}

function FilterSidebar({
  activeLensCategory,
  activeNeed,
  activeCategory,
  onLensCategoryChange,
  onNeedChange,
  onCategoryChange,
  onClose,
}: {
  activeLensCategory: string
  activeNeed: string
  activeCategory: string
  onLensCategoryChange: (id: string) => void
  onNeedChange: (id: string) => void
  onCategoryChange: (id: string) => void
  onClose?: () => void
}) {
  const filterBtnClass = (isActive: boolean) =>
    `w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white font-medium shadow-primary-sm'
        : 'text-gray-600 hover:bg-primary-50 hover:text-primary'
    }`

  function handleSelect(setter: (id: string) => void, id: string) {
    setter(id)
    onClose?.()
  }

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="lg:sticky lg:top-28 space-y-2">
        
        {/* Lens Category — open by default */}
        <AccordionSection title="Lens Type" defaultOpen={true}>
          {lensCategories.map((cat) => (
            <button key={cat.id}
              onClick={() => handleSelect(onLensCategoryChange, cat.id)}
              className={filterBtnClass(activeLensCategory === cat.id)}>
              {cat.name_en}
            </button>
          ))}
        </AccordionSection>

        {/* Needs — collapsed by default */}
        <AccordionSection title="Need">
          {lensNeeds.map((need) => (
            <button key={need.id}
              onClick={() => handleSelect(onNeedChange, need.id)}
              className={filterBtnClass(activeNeed === need.id)}>
              {need.name_en}
            </button>
          ))}
        </AccordionSection>

        {/* Frame Shape — collapsed by default */}
        <AccordionSection title="Frame Shape">
          {categories.map((cat) => (
            <button key={cat.id}
              onClick={() => handleSelect(onCategoryChange, cat.id)}
              className={filterBtnClass(activeCategory === cat.id)}>
              {cat.name_en}
            </button>
          ))}
        </AccordionSection>
      </div>
    </aside>
  )
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeLensCategory, setActiveLensCategory] = useState('all')
  const [activeNeed, setActiveNeed] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Filter by frame shape category
  const filteredByCategory = activeCategory === 'all'
    ? glasses
    : glasses.filter(g => g.category_slug === activeCategory)

  // Then filter by lens category
  const filteredByLensCategory = activeLensCategory === 'all'
    ? filteredByCategory
    : filteredByCategory.filter(g => g.lens_category_slugs?.includes(activeLensCategory))

  // Then filter by need
  const filteredGlasses = activeNeed === 'all'
    ? filteredByLensCategory
    : filteredByLensCategory.filter(g => g.lens_need_slugs?.includes(activeNeed))

  // Count active filters
  const activeFilterCount = (activeLensCategory !== 'all' ? 1 : 0) +
    (activeNeed !== 'all' ? 1 : 0) +
    (activeCategory !== 'all' ? 1 : 0)

  return (
    <>
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-stats" />
        <div className="max-w-content mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
            Our Collection
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-white font-extrabold mb-6">
            Premium Eyewear
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover our curated selection of frames — designed for comfort,
            crafted for style.
          </p>
        </div>
      </section>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-content mx-auto px-6 lg:px-8 py-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2 w-full justify-center px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-primary hover:text-primary transition-all">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V17a1 1 0 01-.553.894l-4 2A1 1 0 019 19v-5.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <>
              <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setSidebarOpen(false)} />
              <div className="fixed inset-y-0 left-0 w-72 bg-white z-50 overflow-y-auto p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                  <button onClick={() => setSidebarOpen(false)}
                    title="Close filters"
                    className="p-1 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar
                  activeLensCategory={activeLensCategory}
                  activeNeed={activeNeed}
                  activeCategory={activeCategory}
                  onLensCategoryChange={setActiveLensCategory}
                  onNeedChange={setActiveNeed}
                  onCategoryChange={setActiveCategory}
                  onClose={() => setSidebarOpen(false)}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area — Sidebar + Grid */}
      <section className="py-section bg-snow">
        <div className="max-w-content mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

            {/* Left Sidebar — Desktop */}
            <div className="hidden lg:block">
              <FilterSidebar
                activeLensCategory={activeLensCategory}
                activeNeed={activeNeed}
                activeCategory={activeCategory}
                onLensCategoryChange={setActiveLensCategory}
                onNeedChange={setActiveNeed}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Right — Products */}
            <div className="flex-1 min-w-0">
              {/* Result count + active filter chips */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <p className="text-sm text-gray-400">
                  {filteredGlasses.length} {filteredGlasses.length === 1 ? 'frame' : 'frames'} found
                </p>

                {/* Active filter chips */}
                {activeLensCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-50 text-primary text-xs font-medium">
                    {lensCategories.find(c => c.id === activeLensCategory)?.name_en}
                    <button onClick={() => setActiveLensCategory('all')} title="Clear lens filter" className="ml-0.5 hover:text-primary-700">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {activeNeed !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-charcoal/10 text-charcoal text-xs font-medium">
                    {lensNeeds.find(n => n.id === activeNeed)?.name_en}
                    <button onClick={() => setActiveNeed('all')} title="Clear need filter" className="ml-0.5 hover:text-charcoal/70">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                    {categories.find(c => c.id === activeCategory)?.name_en}
                    <button onClick={() => setActiveCategory('all')} title="Clear frame filter" className="ml-0.5 hover:text-gray-800">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>

              {/* Products Grid */}
              <motion.div
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filteredGlasses.map((glass, i) => (
                    <motion.div
                      key={glass.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1, transition: { delay: i * 0.05 } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <GlassCard glass={glass} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Empty state */}
              {filteredGlasses.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg mb-2">No frames match your criteria</p>
                  <p className="text-gray-300 text-sm">Try adjusting the filters on the left</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}