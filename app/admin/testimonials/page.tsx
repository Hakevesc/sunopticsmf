'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Plus, Star, Trash2, AlertCircle, X } from 'lucide-react'

interface Testimonial {
  id: string
  author_name: string
  rating: number | string | null
  review_text_en: string
  source: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

interface AddForm {
  author_name: string
  rating: number
  review_text_en: string
  source: string
  is_featured: boolean
}

const emptyForm: AddForm = {
  author_name: '',
  rating: 5,
  review_text_en: '',
  source: 'google',
  is_featured: false,
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState<AddForm>({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: e } = await supabase
        .from('testimonials')
        .select('id, author_name, rating, review_text_en, source, is_featured, is_active, created_at')
        .order('created_at', { ascending: false })
      if (e) throw e
      setItems((data || []) as Testimonial[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonials')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleAdd = async () => {
    if (!form.author_name.trim() || !form.review_text_en.trim()) {
      setError('Author name and review text are required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { error: e } = await supabase.from('testimonials').insert({
        author_name: form.author_name.trim(),
        rating: form.rating,
        review_text_en: form.review_text_en.trim(),
        source: form.source.trim() || null,
        is_featured: form.is_featured,
        is_active: true,
      })
      if (e) throw e
      setShowAdd(false)
      setForm({ ...emptyForm })
      fetchItems()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add testimonial')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (t: Testimonial) => {
    setBusyId(t.id)
    try {
      await supabase.from('testimonials').update({ is_active: !t.is_active }).eq('id', t.id)
      setItems(prev => prev.map(x => x.id === t.id ? { ...x, is_active: !x.is_active } : x))
    } finally {
      setBusyId(null)
    }
  }

  const toggleFeatured = async (t: Testimonial) => {
    setBusyId(t.id)
    try {
      await supabase.from('testimonials').update({ is_featured: !t.is_featured }).eq('id', t.id)
      setItems(prev => prev.map(x => x.id === t.id ? { ...x, is_featured: !x.is_featured } : x))
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this testimonial? This cannot be undone.')) return
    setBusyId(id)
    try {
      const { error: e } = await supabase.from('testimonials').delete().eq('id', id)
      if (e) throw e
      setItems(prev => prev.filter(x => x.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${items.length} total · ${items.filter(i => i.is_active).length} active`}
          </p>
        </div>
        <button
          onClick={() => { setForm({ ...emptyForm }); setError(''); setShowAdd(true) }}
          className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5
                     text-sm font-medium hover:bg-primary-dark transition-all"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Author</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Rating</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Review</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Flags</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No testimonials yet</td></tr>
              ) : items.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-charcoal">{t.author_name}</div>
                    {t.source && <div className="text-xs text-gray-400">{t.source}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-amber-500 font-medium">
                      <Star size={14} fill="currentColor" />
                      {t.rating === null || t.rating === undefined ? '—' : Number(t.rating).toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-md">
                    <p className="line-clamp-2">{t.review_text_en}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => toggleActive(t)}
                        disabled={busyId === t.id}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${t.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                      >
                        {t.is_active ? 'Active' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => toggleFeatured(t)}
                        disabled={busyId === t.id}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${t.is_featured ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {t.is_featured ? 'Featured' : 'Standard'}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => remove(t.id)}
                      disabled={busyId === t.id}
                      className="inline-flex items-center gap-1 text-red-500 hover:text-red-700
                                 disabled:opacity-50 text-sm"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div onClick={() => setShowAdd(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-charcoal">Add Testimonial</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Author Name *</label>
                <input
                  type="text"
                  value={form.author_name}
                  onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                             focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  placeholder="e.g., Samuel Melesse"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Rating</label>
                  <select
                    value={form.rating}
                    onChange={e => setForm(p => ({ ...p, rating: Number(e.target.value) }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                               focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white"
                  >
                    {[5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1].map(n => (
                      <option key={n} value={n}>{n.toFixed(1)} stars</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Source</label>
                  <input
                    type="text"
                    value={form.source}
                    onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                               focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                    placeholder="google, facebook…"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Review *</label>
                <textarea
                  value={form.review_text_en}
                  onChange={e => setForm(p => ({ ...p, review_text_en: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                             focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none"
                  placeholder="What did they say?"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                />
                Mark as Featured
              </label>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600
                           hover:border-gray-300"
              >Cancel</button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium
                           hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
