'use client'
import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

/* ── Static maps ── */
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

const frameShapes = [
  { slug: 'cat-eye-butterfly', name: 'Cat-Eye / Butterfly' },
  { slug: 'rounded-rectangle', name: 'Rounded Rectangle' },
  { slug: 'round-oval', name: 'Round / Oval' },
  { slug: 'wayfarer-square', name: 'Wayfarer / Square' },
  { slug: 'sunglasses', name: 'Sunglasses' },
  { slug: 'rectangle', name: 'Rectangle' },
  { slug: 'modified-rectangle', name: 'Modified Rectangle' },
]

/* ── Types ── */
interface Glass {
  id: string
  name_en: string
  name_am?: string
  glass_code?: string
  image_url?: string
  category_slug: string
  glass_categories?: { name_en: string }
  lens_category_slugs: string[]
  lens_need_slugs: string[]
  is_featured?: boolean
  is_new?: boolean
  price_range?: string
  description_en?: string
}

interface AddProductForm {
  name_en: string
  name_am: string
  glass_code: string
  category_slug: string
  description_en: string
  price_range: string
  is_featured: boolean
  is_new: boolean
  lens_category_slugs: string[]
  lens_need_slugs: string[]
  imageFile: File | null
  imagePreview: string
}

const emptyForm: AddProductForm = {
  name_en: '',
  name_am: '',
  glass_code: '',
  category_slug: '',
  description_en: '',
  price_range: '',
  is_featured: false,
  is_new: false,
  lens_category_slugs: [],
  lens_need_slugs: [],
  imageFile: null,
  imagePreview: '',
}

export default function AdminProductsPage() {
  const [glasses, setGlasses] = useState<Glass[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')

  /* Edit state */
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    lens_category_slugs: string[]
    lens_need_slugs: string[]
  }>({ lens_category_slugs: [], lens_need_slugs: [] })

  /* Add Product state */
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState<AddProductForm>({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState('')

  /* Delete state */
  const [deletingId, setDeletingId] = useState<string | null>(null)

  /* ── Fetch products from Supabase ── */
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data: glassesData, error: glassesError } = await supabase
        .from('glasses')
        .select('id, name_en, name_am, glass_code, image_url, is_featured, is_new, price_range, description_en, glass_categories ( name_en, slug )')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (glassesError) throw glassesError

      const { data: lcData } = await supabase
        .from('glasses_lens_categories')
        .select('glass_id, lens_categories ( slug )')

      const { data: lnData } = await supabase
        .from('glasses_lens_needs')
        .select('glass_id, lens_needs ( slug )')

      const lcMap: Record<string, string[]> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lcData?.forEach((row: any) => {
        if (!lcMap[row.glass_id]) lcMap[row.glass_id] = []
        if (row.lens_categories?.slug) lcMap[row.glass_id].push(row.lens_categories.slug)
      })

      const lnMap: Record<string, string[]> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lnData?.forEach((row: any) => {
        if (!lnMap[row.glass_id]) lnMap[row.glass_id] = []
        if (row.lens_needs?.slug) lnMap[row.glass_id].push(row.lens_needs.slug)
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: Glass[] = (glassesData || []).map((g: any) => ({
        id: g.id,
        name_en: g.name_en,
        name_am: g.name_am,
        glass_code: g.glass_code,
        image_url: g.image_url,
        is_featured: g.is_featured,
        is_new: g.is_new,
        price_range: g.price_range,
        description_en: g.description_en,
        category_slug: g.glass_categories?.slug || '',
        glass_categories: g.glass_categories ? { name_en: g.glass_categories.name_en } : undefined,
        lens_category_slugs: lcMap[g.id] || [],
        lens_need_slugs: lnMap[g.id] || [],
      }))

      setGlasses(mapped)
    } catch (err) {
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  /* ── Edit handlers ── */
  const startEditing = (glass: Glass) => {
    setEditingId(glass.id)
    setEditForm({
      lens_category_slugs: [...glass.lens_category_slugs],
      lens_need_slugs: [...glass.lens_need_slugs],
    })
  }

  const toggleEditLensCategory = (slug: string) => {
    setEditForm(prev => ({
      ...prev,
      lens_category_slugs: prev.lens_category_slugs.includes(slug)
        ? prev.lens_category_slugs.filter(s => s !== slug)
        : [...prev.lens_category_slugs, slug],
    }))
  }

  const toggleEditLensNeed = (slug: string) => {
    setEditForm(prev => ({
      ...prev,
      lens_need_slugs: prev.lens_need_slugs.includes(slug)
        ? prev.lens_need_slugs.filter(s => s !== slug)
        : [...prev.lens_need_slugs, slug],
    }))
  }

  const saveEditChanges = async () => {
    if (!editingId) return
    setSaving(true)
    try {
      await supabase.from('glasses_lens_categories').delete().eq('glass_id', editingId)
      await supabase.from('glasses_lens_needs').delete().eq('glass_id', editingId)

      if (editForm.lens_category_slugs.length > 0) {
        const { data: lcRows } = await supabase
          .from('lens_categories')
          .select('id, slug')
          .in('slug', editForm.lens_category_slugs)
        if (lcRows && lcRows.length > 0) {
          await supabase.from('glasses_lens_categories').insert(
            lcRows.map(lc => ({ glass_id: editingId, lens_category_id: lc.id }))
          )
        }
      }

      if (editForm.lens_need_slugs.length > 0) {
        const { data: lnRows } = await supabase
          .from('lens_needs')
          .select('id, slug')
          .in('slug', editForm.lens_need_slugs)
        if (lnRows && lnRows.length > 0) {
          await supabase.from('glasses_lens_needs').insert(
            lnRows.map(ln => ({ glass_id: editingId, lens_need_id: ln.id }))
          )
        }
      }

      setGlasses(prev => prev.map(g =>
        g.id === editingId
          ? { ...g, lens_category_slugs: editForm.lens_category_slugs, lens_need_slugs: editForm.lens_need_slugs }
          : g
      ))
      setEditingId(null)
    } catch (err) {
      console.error('Error saving edit:', err)
    } finally {
      setSaving(false)
    }
  }

  /* ── Add Product handlers ── */
  const openAddModal = () => {
    setAddForm({ ...emptyForm })
    setSaveError('')
    setSaveSuccess('')
    setShowAddModal(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setSaveError('Please select a valid image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setSaveError('Image must be smaller than 5MB.')
      return
    }
    setSaveError('')
    const preview = URL.createObjectURL(file)
    setAddForm(prev => ({ ...prev, imageFile: file, imagePreview: preview }))
  }

  const toggleAddLensCategory = (slug: string) => {
    setAddForm(prev => ({
      ...prev,
      lens_category_slugs: prev.lens_category_slugs.includes(slug)
        ? prev.lens_category_slugs.filter(s => s !== slug)
        : [...prev.lens_category_slugs, slug],
    }))
  }

  const toggleAddLensNeed = (slug: string) => {
    setAddForm(prev => ({
      ...prev,
      lens_need_slugs: prev.lens_need_slugs.includes(slug)
        ? prev.lens_need_slugs.filter(s => s !== slug)
        : [...prev.lens_need_slugs, slug],
    }))
  }

  const handleAddProduct = async () => {
    if (!addForm.name_en.trim()) {
      setSaveError('Product name (English) is required.')
      return
    }
    if (!addForm.glass_code.trim()) {
      setSaveError('Glass code is required.')
      return
    }
    if (!addForm.category_slug) {
      setSaveError('Please select a frame shape.')
      return
    }

    setSaving(true)
    setSaveError('')
    setSaveSuccess('')

    try {
      let imageUrl = ''
      if (addForm.imageFile) {
        const fileExt = addForm.imageFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `glasses/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, addForm.imageFile)

        if (uploadError) {
          console.warn('Storage upload failed, using local path:', uploadError.message)
          imageUrl = `/Glasses/${addForm.imageFile.name}`
        } else {
          const { data: urlData } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath)
          imageUrl = urlData.publicUrl
        }
      }

      const { data: catData, error: catError } = await supabase
        .from('glass_categories')
        .select('id')
        .eq('slug', addForm.category_slug)
        .single()

      if (catError || !catData) {
        throw new Error('Could not find selected frame shape category.')
      }

      const { data: newGlass, error: insertError } = await supabase
        .from('glasses')
        .insert({
          name_en: addForm.name_en.trim(),
          name_am: addForm.name_am.trim() || null,
          glass_code: addForm.glass_code.trim(),
          category_id: catData.id,
          image_url: imageUrl || null,
          description_en: addForm.description_en.trim() || null,
          price_range: addForm.price_range.trim() || null,
          is_featured: addForm.is_featured,
          is_new: addForm.is_new,
          is_active: true,
        })
        .select('id')
        .single()

      if (insertError || !newGlass) {
        throw new Error(insertError?.message || 'Failed to insert product.')
      }

      if (addForm.lens_category_slugs.length > 0) {
        const { data: lcRows } = await supabase
          .from('lens_categories')
          .select('id, slug')
          .in('slug', addForm.lens_category_slugs)
        if (lcRows && lcRows.length > 0) {
          await supabase.from('glasses_lens_categories').insert(
            lcRows.map(lc => ({ glass_id: newGlass.id, lens_category_id: lc.id }))
          )
        }
      }

      if (addForm.lens_need_slugs.length > 0) {
        const { data: lnRows } = await supabase
          .from('lens_needs')
          .select('id, slug')
          .in('slug', addForm.lens_need_slugs)
        if (lnRows && lnRows.length > 0) {
          await supabase.from('glasses_lens_needs').insert(
            lnRows.map(ln => ({ glass_id: newGlass.id, lens_need_id: ln.id }))
          )
        }
      }

      setSaveSuccess('Product added successfully!')
      setTimeout(() => {
        setShowAddModal(false)
        setSaveSuccess('')
        fetchProducts()
      }, 1200)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setSaving(false)
    }
  }

  /* ── Delete handler ── */
  const handleDeleteProduct = async (id: string) => {
    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('glasses')
        .update({ is_active: false })
        .eq('id', id)
      if (error) throw error
      setGlasses(prev => prev.filter(g => g.id !== id))
    } catch (err) {
      console.error('Error deleting product:', err)
    } finally {
      setDeletingId(null)
    }
  }

  /* ── Filtered list ── */
  const filteredGlasses = glasses.filter(g => {
    const matchesSearch = !searchQuery ||
      g.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.glass_code?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !filterCategory || g.category_slug === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <Link href="/admin" style={{ fontSize: 14, color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#010E3D', margin: 0 }}>Manage Products</h1>
          <p style={{ color: '#9CA3AF', marginTop: 4, fontSize: 14 }}>
            {loading ? 'Loading...' : `${glasses.length} products`} · Add, edit and manage eyewear inventory.
          </p>
        </div>
        <button
          id="add-product-btn"
          onClick={openAddModal}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 9999, fontSize: 14, fontWeight: 600,
            background: '#010E3D', color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(1,14,61,0.25)',
            transition: 'all 0.3s ease',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            id="search-products"
            type="text"
            placeholder="Search by name or code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10,
              borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14,
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <select
          id="filter-category"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB',
            fontSize: 14, color: '#4B5563', background: '#fff', minWidth: 180,
            outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="">All Frame Shapes</option>
          {frameShapes.map(fs => (
            <option key={fs.slug} value={fs.slug}>{fs.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {loading ? (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6', padding: 64, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: 32, height: 32, border: '2px solid rgba(1,14,61,0.3)', borderTopColor: '#010E3D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#9CA3AF', marginTop: 16, fontSize: 14 }}>Loading products...</p>
        </div>
      ) : filteredGlasses.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6', padding: 64, textAlign: 'center' }}>
          <p style={{ color: '#6B7280', fontWeight: 500 }}>No products found</p>
          <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>
            {searchQuery || filterCategory ? 'Try adjusting your search or filter.' : 'Click "Add Product" to get started.'}
          </p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #F3F4F6', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 1000, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #F3F4F6' }}>
                  <th style={{ textAlign: 'left', padding: 16, fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Product</th>
                  <th style={{ textAlign: 'left', padding: 16, fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Code</th>
                  <th style={{ textAlign: 'left', padding: 16, fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frame Shape</th>
                  <th style={{ textAlign: 'left', padding: 16, fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lens Category</th>
                  <th style={{ textAlign: 'left', padding: 16, fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Needs</th>
                  <th style={{ textAlign: 'left', padding: 16, fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGlasses.map(glass => (
                  <tr key={glass.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {glass.image_url ? (
                          <div style={{ width: 40, height: 40, borderRadius: 8, overflow: 'hidden', background: '#F3F4F6', flexShrink: 0 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={glass.image_url} alt={glass.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ) : (
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#D1D5DB" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <span style={{ fontSize: 14, fontWeight: 500, color: '#010E3D', display: 'block' }}>{glass.name_en}</span>
                          <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
                            {glass.is_new && (
                              <span style={{ padding: '1px 6px', borderRadius: 4, background: '#ECFDF5', color: '#059669', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>New</span>
                            )}
                            {glass.is_featured && (
                              <span style={{ padding: '1px 6px', borderRadius: 4, background: '#FFFBEB', color: '#D97706', fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>Featured</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: 16, fontSize: 14, color: '#9CA3AF', fontFamily: 'monospace' }}>{glass.glass_code || '—'}</td>
                    <td style={{ padding: 16 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 9999, background: '#FBF8F3', color: '#010E3D', fontSize: 10, fontWeight: 500 }}>
                        {glass.glass_categories?.name_en || '—'}
                      </span>
                    </td>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {glass.lens_category_slugs?.map(slug => (
                          <span key={slug} style={{ padding: '2px 8px', borderRadius: 9999, background: 'rgba(6,172,228,0.1)', color: '#06ACE4', fontSize: 10, fontWeight: 500 }}>
                            {lensCategoriesMap[slug] || slug}
                          </span>
                        ))}
                        {(!glass.lens_category_slugs || glass.lens_category_slugs.length === 0) && (
                          <span style={{ fontSize: 12, color: '#D1D5DB' }}>None assigned</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {glass.lens_need_slugs?.map(slug => (
                          <span key={slug} style={{ padding: '2px 8px', borderRadius: 9999, background: '#FFFBEB', color: '#D97706', fontSize: 10, fontWeight: 500 }}>
                            {lensNeedsMap[slug] || slug}
                          </span>
                        ))}
                        {(!glass.lens_need_slugs || glass.lens_need_slugs.length === 0) && (
                          <span style={{ fontSize: 12, color: '#D1D5DB' }}>None assigned</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button onClick={() => startEditing(glass)} style={{ color: '#010E3D', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                          Edit
                        </button>
                        <span style={{ color: '#E5E7EB' }}>|</span>
                        <button
                          onClick={() => handleDeleteProduct(glass.id)}
                          disabled={deletingId === glass.id}
                          style={{ color: '#EF4444', fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: deletingId === glass.id ? 'not-allowed' : 'pointer', textDecoration: 'underline', opacity: deletingId === glass.id ? 0.5 : 1 }}
                        >
                          {deletingId === glass.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Edit Modal ─── */}
      {editingId && (
        <div onClick={() => setEditingId(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: 512, width: '100%', padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#010E3D', margin: 0 }}>
                Edit: {glasses.find(g => g.id === editingId)?.name_en}
              </h2>
              <button onClick={() => setEditingId(null)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                &times;
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Lens Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lensCategories.map(cat => (
                  <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                    <input type="checkbox" checked={editForm.lens_category_slugs.includes(cat.id)} onChange={() => toggleEditLensCategory(cat.id)} style={{ width: 16, height: 16 }} />
                    <span style={{ fontSize: 14, color: '#010E3D' }}>{cat.name_en}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Needs</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lensNeedsList.map(need => (
                  <label key={need.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 8, borderRadius: 8 }}>
                    <input type="checkbox" checked={editForm.lens_need_slugs.includes(need.id)} onChange={() => toggleEditLensNeed(need.id)} style={{ width: 16, height: 16 }} />
                    <span style={{ fontSize: 14, color: '#010E3D' }}>{need.name_en}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingId(null)} style={{ padding: '10px 24px', borderRadius: 9999, fontSize: 14, fontWeight: 500, color: '#6B7280', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={saveEditChanges} disabled={saving} style={{ padding: '10px 24px', borderRadius: 9999, fontSize: 14, fontWeight: 500, background: '#010E3D', color: '#fff', border: 'none', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add Product Modal ─── */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxWidth: 672, width: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

            {/* Modal Header */}
            <div style={{ padding: '20px 32px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#010E3D', margin: 0 }}>Add New Product</h2>
                <p style={{ fontSize: 14, color: '#9CA3AF', marginTop: 2 }}>Fill in the product details below.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3F4F6', border: 'none', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 32, overflowY: 'auto', flex: 1 }}>
              {/* Error/Success */}
              {saveError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, background: '#FEF2F2', border: '1px solid #FEE2E2', fontSize: 14, color: '#DC2626', marginBottom: 24 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
                  {saveError}
                </div>
              )}
              {saveSuccess && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, background: '#ECFDF5', border: '1px solid #D1FAE5', fontSize: 14, color: '#059669', marginBottom: 24 }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  {saveSuccess}
                </div>
              )}

              {/* Basic Info */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Basic Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <label htmlFor="add-name-en" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#010E3D', marginBottom: 6 }}>
                      Product Name (English) <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <input id="add-name-en" type="text" value={addForm.name_en} onChange={e => setAddForm(prev => ({ ...prev, name_en: e.target.value }))} placeholder="e.g., Classic Round Black Frame" style={{ width: '100%', padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label htmlFor="add-name-am" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#010E3D', marginBottom: 6 }}>
                      Product Name (Amharic)
                    </label>
                    <input id="add-name-am" type="text" value={addForm.name_am} onChange={e => setAddForm(prev => ({ ...prev, name_am: e.target.value }))} placeholder="e.g., ክላሲክ ክብ ጥቁር ፍሬም" style={{ width: '100%', padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </div>

              {/* Code + Shape */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div>
                  <label htmlFor="add-glass-code" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#010E3D', marginBottom: 6 }}>
                    Glass Code <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input id="add-glass-code" type="text" value={addForm.glass_code} onChange={e => setAddForm(prev => ({ ...prev, glass_code: e.target.value }))} placeholder="e.g., 28 011 52 17-140 C5" style={{ width: '100%', padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, fontFamily: 'monospace', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label htmlFor="add-frame-shape" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#010E3D', marginBottom: 6 }}>
                    Frame Shape <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select id="add-frame-shape" value={addForm.category_slug} onChange={e => setAddForm(prev => ({ ...prev, category_slug: e.target.value }))} style={{ width: '100%', padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, background: '#fff', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                    <option value="">Select frame shape...</option>
                    {frameShapes.map(fs => (
                      <option key={fs.slug} value={fs.slug}>{fs.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price + Description */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div>
                  <label htmlFor="add-price-range" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#010E3D', marginBottom: 6 }}>Price Range</label>
                  <select id="add-price-range" value={addForm.price_range} onChange={e => setAddForm(prev => ({ ...prev, price_range: e.target.value }))} style={{ width: '100%', padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, background: '#fff', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                    <option value="">Select price range...</option>
                    <option value="$">$ — Budget</option>
                    <option value="$$">$$ — Standard</option>
                    <option value="$$$">$$$ — Premium</option>
                    <option value="$$$$">$$$$ — Luxury</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="add-description" style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#010E3D', marginBottom: 6 }}>Short Description</label>
                  <input id="add-description" type="text" value={addForm.description_en} onChange={e => setAddForm(prev => ({ ...prev, description_en: e.target.value }))} placeholder="Brief product description..." style={{ width: '100%', padding: '10px 16px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* Flags */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={addForm.is_new} onChange={e => setAddForm(prev => ({ ...prev, is_new: e.target.checked }))} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 14, color: '#010E3D' }}>Mark as New</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={addForm.is_featured} onChange={e => setAddForm(prev => ({ ...prev, is_featured: e.target.checked }))} style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: 14, color: '#010E3D' }}>Featured Product</span>
                </label>
              </div>

              {/* Image Upload */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Product Image</h3>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <label htmlFor="add-image-upload" style={{ flex: 1, border: '2px dashed #E5E7EB', borderRadius: 16, padding: 24, textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <input id="add-image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="#9CA3AF" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: '#010E3D', margin: 0 }}>Click to upload image</p>
                    <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>PNG, JPG, WebP or AVIF · Max 5MB</p>
                  </label>
                  {addForm.imagePreview && (
                    <div style={{ position: 'relative', width: 112, height: 112, borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB', flexShrink: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={addForm.imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button onClick={() => setAddForm(prev => ({ ...prev, imageFile: null, imagePreview: '' }))} style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        &times;
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Lens Categories */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Lens Categories</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {lensCategories.map(cat => (
                    <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 12, borderRadius: 12, border: addForm.lens_category_slugs.includes(cat.id) ? '1px solid #06ACE4' : '1px solid #E5E7EB', background: addForm.lens_category_slugs.includes(cat.id) ? 'rgba(6,172,228,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                      <input type="checkbox" checked={addForm.lens_category_slugs.includes(cat.id)} onChange={() => toggleAddLensCategory(cat.id)} style={{ width: 16, height: 16 }} />
                      <span style={{ fontSize: 14, color: '#010E3D' }}>{cat.name_en}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Lens Needs */}
              <div>
                <h3 style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Lens Needs</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {lensNeedsList.map(need => (
                    <label key={need.id} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: 12, borderRadius: 12, border: addForm.lens_need_slugs.includes(need.id) ? '1px solid #D97706' : '1px solid #E5E7EB', background: addForm.lens_need_slugs.includes(need.id) ? 'rgba(217,119,6,0.05)' : 'transparent', transition: 'all 0.2s' }}>
                      <input type="checkbox" checked={addForm.lens_need_slugs.includes(need.id)} onChange={() => toggleAddLensNeed(need.id)} style={{ width: 16, height: 16 }} />
                      <span style={{ fontSize: 14, color: '#010E3D' }}>{need.name_en}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '16px 32px', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 12, justifyContent: 'flex-end', flexShrink: 0 }}>
              <button onClick={() => setShowAddModal(false)} disabled={saving} style={{ padding: '10px 24px', borderRadius: 9999, fontSize: 14, fontWeight: 500, color: '#6B7280', border: '1px solid #E5E7EB', background: '#fff', cursor: 'pointer', opacity: saving ? 0.5 : 1 }}>
                Cancel
              </button>
              <button
                id="save-product-btn"
                onClick={handleAddProduct}
                disabled={saving}
                style={{
                  padding: '10px 32px', borderRadius: 9999, fontSize: 14, fontWeight: 600,
                  background: '#010E3D', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 4px 14px rgba(1,14,61,0.25)',
                }}
              >
                {saving ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    Saving...
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}