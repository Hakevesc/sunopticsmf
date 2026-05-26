'use client'
import { useState } from 'react'

const lensCategoriesMap: Record<string, string> = {
  'correct-your-vision': 'Correct Your Vision',
  'protect-your-eyes': 'Protect Your Eyes',
  'enhance-your-vision': 'Enhance Your Vision',
}

const lensNeedsMap: Record<string, string> = {
  'for-kids': 'For Kids',
  'near-vision': 'Near Vision',
  'far-vision': 'Far Vision',
  'blue-light-protection': 'Blue Light Protection',
  'sun-protection': 'Sun Protection',
  'light-sensitivity': 'Light Sensitivity',
  'lens-durability': 'Lens Durability',
}

const lensCategories = [
  { id: 'correct-your-vision', name_en: 'Correct Your Vision' },
  { id: 'protect-your-eyes', name_en: 'Protect Your Eyes' },
  { id: 'enhance-your-vision', name_en: 'Enhance Your Vision' },
]

const lensNeedsList = [
  { id: 'for-kids', name_en: 'For Kids' },
  { id: 'near-vision', name_en: 'Near Vision' },
  { id: 'far-vision', name_en: 'Far Vision' },
  { id: 'blue-light-protection', name_en: 'Blue Light Protection' },
  { id: 'sun-protection', name_en: 'Sun Protection' },
  { id: 'light-sensitivity', name_en: 'Light Sensitivity' },
  { id: 'lens-durability', name_en: 'Lens Durability' },
]

const initialGlasses = [
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

interface Glass {
  id: string
  name_en: string
  glass_code?: string
  image_url?: string
  category_slug: string
  glass_categories?: { name_en: string }
  lens_category_slugs: string[]
  lens_need_slugs: string[]
}

export default function AdminProductsPage() {
  const [glasses, setGlasses] = useState<Glass[]>(initialGlasses)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    lens_category_slugs: string[]
    lens_need_slugs: string[]
  }>({ lens_category_slugs: [], lens_need_slugs: [] })

  const startEditing = (glass: Glass) => {
    setEditingId(glass.id)
    setEditForm({
      lens_category_slugs: [...glass.lens_category_slugs],
      lens_need_slugs: [...glass.lens_need_slugs],
    })
  }

  const toggleLensCategory = (slug: string) => {
    setEditForm(prev => ({
      ...prev,
      lens_category_slugs: prev.lens_category_slugs.includes(slug)
        ? prev.lens_category_slugs.filter(s => s !== slug)
        : [...prev.lens_category_slugs, slug],
    }))
  }

  const toggleLensNeed = (slug: string) => {
    setEditForm(prev => ({
      ...prev,
      lens_need_slugs: prev.lens_need_slugs.includes(slug)
        ? prev.lens_need_slugs.filter(s => s !== slug)
        : [...prev.lens_need_slugs, slug],
    }))
  }

  const saveChanges = () => {
    setGlasses(prev => prev.map(g =>
      g.id === editingId
        ? { ...g, lens_category_slugs: editForm.lens_category_slugs, lens_need_slugs: editForm.lens_need_slugs }
        : g
    ))
    setEditingId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Manage Products</h1>
        <p className="text-gray-500 mt-1">Assign lens categories and needs to each eyewear product.</p>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Frame Shape</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lens Category</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Needs</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {glasses.map(glass => (
                <tr key={glass.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-charcoal">{glass.name_en}</td>
                  <td className="p-4 text-sm text-gray-400 font-mono">{glass.glass_code}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary text-[10px] font-medium">
                      {glass.glass_categories?.name_en}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {glass.lens_category_slugs?.map(slug => (
                        <span key={slug} className="px-2 py-0.5 rounded-full bg-[#C9A96E]/10 text-[#C9A96E] text-[10px] font-medium">
                          {lensCategoriesMap[slug]}
                        </span>
                      ))}
                      {(!glass.lens_category_slugs || glass.lens_category_slugs.length === 0) && (
                        <span className="text-xs text-gray-300">None assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {glass.lens_need_slugs?.map(slug => (
                        <span key={slug} className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-medium">
                          {lensNeedsMap[slug]}
                        </span>
                      ))}
                      {(!glass.lens_need_slugs || glass.lens_need_slugs.length === 0) && (
                        <span className="text-xs text-gray-300">None assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => startEditing(glass)}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-charcoal">
                Edit: {glasses.find(g => g.id === editingId)?.name_en}
              </h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Lens Category Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                Lens Category
              </h3>
              <div className="space-y-2">
                {lensCategories.map(cat => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.lens_category_slugs.includes(cat.id)}
                      onChange={() => toggleLensCategory(cat.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-charcoal">{cat.name_en}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Lens Needs Selection */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">
                Needs
              </h3>
              <div className="space-y-2">
                {lensNeedsList.map(need => (
                  <label key={need.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editForm.lens_need_slugs.includes(need.id)}
                      onChange={() => toggleLensNeed(need.id)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-charcoal">{need.name_en}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setEditingId(null)}
                className="px-6 py-2.5 rounded-full text-sm font-medium text-gray-500 border border-gray-200 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-2.5 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}