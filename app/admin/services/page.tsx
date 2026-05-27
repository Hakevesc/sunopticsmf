'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Plus, Trash2, Pencil, AlertCircle, X, ScanEye, Glasses } from 'lucide-react'

interface Service {
  id: string
  name_en: string
  name_am: string | null
  description_en: string | null
  description_am: string | null
  icon_name: string | null
  image_url: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

interface ServiceForm {
  id: string | null
  name_en: string
  name_am: string
  description_en: string
  description_am: string
  icon_name: string
  image_url: string
  display_order: number
  is_active: boolean
}

const emptyForm: ServiceForm = {
  id: null,
  name_en: '',
  name_am: '',
  description_en: '',
  description_am: '',
  icon_name: 'scan-eye',
  image_url: '',
  display_order: 0,
  is_active: true,
}

const ICON_OPTIONS = [
  { value: 'scan-eye', label: 'Scan Eye' },
  { value: 'glasses', label: 'Glasses' },
]

function IconPreview({ name }: { name: string | null }) {
  if (name === 'glasses') return <Glasses size={18} />
  return <ScanEye size={18} />
}

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<ServiceForm>({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: e } = await supabase
        .from('services')
        .select('id, name_en, name_am, description_en, description_am, icon_name, image_url, display_order, is_active, created_at')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true })
      if (e) throw e
      setItems((data || []) as Service[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const openAdd = () => {
    const nextOrder = Math.max(0, ...items.map(i => i.display_order)) + 1
    setForm({ ...emptyForm, display_order: nextOrder })
    setError('')
    setShowModal(true)
  }

  const openEdit = (s: Service) => {
    setForm({
      id: s.id,
      name_en: s.name_en,
      name_am: s.name_am || '',
      description_en: s.description_en || '',
      description_am: s.description_am || '',
      icon_name: s.icon_name || 'scan-eye',
      image_url: s.image_url || '',
      display_order: s.display_order,
      is_active: s.is_active,
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.name_en.trim()) {
      setError('Name (English) is required')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        name_en: form.name_en.trim(),
        name_am: form.name_am.trim() || null,
        description_en: form.description_en.trim() || null,
        description_am: form.description_am.trim() || null,
        icon_name: form.icon_name || null,
        image_url: form.image_url.trim() || null,
        display_order: form.display_order,
        is_active: form.is_active,
      }

      if (form.id) {
        const { error: e } = await supabase.from('services').update(payload).eq('id', form.id)
        if (e) throw e
        setInfo('Service updated')
      } else {
        const { error: e } = await supabase.from('services').insert(payload)
        if (e) throw e
        setInfo('Service created')
      }
      setShowModal(false)
      fetchItems()
      setTimeout(() => setInfo(''), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (s: Service) => {
    setBusyId(s.id)
    try {
      await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id)
      setItems(prev => prev.map(x => x.id === s.id ? { ...x, is_active: !x.is_active } : x))
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (s: Service) => {
    if (!confirm(`Delete service "${s.name_en}"? This cannot be undone.`)) return
    setBusyId(s.id)
    try {
      const { error: e } = await supabase.from('services').delete().eq('id', s.id)
      if (e) throw e
      setItems(prev => prev.filter(x => x.id !== s.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete (it may still be referenced by bookings)')
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
          <h1 className="text-2xl font-bold text-charcoal">Services</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${items.length} total · ${items.filter(i => i.is_active).length} active`}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5
                     text-sm font-medium hover:bg-primary-dark transition-all"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {info && (
        <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
          {info}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider w-16">Order</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Service</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Description</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No services yet</td></tr>
              ) : items.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 font-mono text-xs">{s.display_order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
                        <IconPreview name={s.icon_name} />
                      </div>
                      <div>
                        <div className="font-medium text-charcoal">{s.name_en}</div>
                        {s.name_am && <div className="text-xs text-gray-400">{s.name_am}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-md">
                    <p className="line-clamp-2">{s.description_en || '—'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleActive(s)}
                      disabled={busyId === s.id}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${s.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {s.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button
                        onClick={() => openEdit(s)}
                        disabled={busyId === s.id}
                        className="inline-flex items-center gap-1 text-charcoal hover:text-primary text-sm"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => remove(s)}
                        disabled={busyId === s.id}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm disabled:opacity-50"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div onClick={() => setShowModal(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-charcoal">
                {form.id ? 'Edit Service' : 'Add Service'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Name (English) *</label>
                  <input
                    type="text"
                    value={form.name_en}
                    onChange={e => setForm(p => ({ ...p, name_en: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                               focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                    placeholder="Computerized Eye Testing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Name (Amharic)</label>
                  <input
                    type="text"
                    value={form.name_am}
                    onChange={e => setForm(p => ({ ...p, name_am: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                               focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                    placeholder="የኮምፒዩተር የዓይን ምርመራ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Description (English)</label>
                <textarea
                  value={form.description_en}
                  onChange={e => setForm(p => ({ ...p, description_en: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                             focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none"
                  placeholder="Brief explanation shown on the public site"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Description (Amharic)</label>
                <textarea
                  value={form.description_am}
                  onChange={e => setForm(p => ({ ...p, description_am: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                             focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Icon</label>
                  <select
                    value={form.icon_name}
                    onChange={e => setForm(p => ({ ...p, icon_name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                               focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none bg-white"
                  >
                    {ICON_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                               focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                    placeholder="/services/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={e => setForm(p => ({ ...p, display_order: Number(e.target.value) || 0 }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                               focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                />
                Active (visible on website + selectable when booking)
              </label>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300"
              >Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium
                           hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Saving…' : (form.id ? 'Save changes' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
