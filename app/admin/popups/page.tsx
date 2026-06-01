'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Plus, Trash2, Pencil, AlertCircle, X,
  Clock, Image as ImageIcon, Type, Phone, Mail, ToggleLeft,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Popup {
  id: string
  title: string | null
  subtitle: string | null
  description: string | null
  has_offer: boolean
  offer_text: string | null
  has_countdown: boolean
  countdown_end: string | null
  cta_text: string | null
  cta_url: string | null
  has_input: boolean
  input_type: string
  input_placeholder: string | null
  image_url: string | null
  design_theme: number
  pages: string[]
  trigger_type: string
  trigger_delay: number
  is_active: boolean
  created_at: string
}

interface PopupForm {
  id: string | null
  title: string
  subtitle: string
  description: string
  has_offer: boolean
  offer_text: string
  has_countdown: boolean
  countdown_end: string
  cta_text: string
  cta_url: string
  has_input: boolean
  input_type: string
  input_placeholder: string
  image_url: string
  design_theme: number
  pages: string[]
  trigger_type: string
  trigger_delay: number
  is_active: boolean
}

const ALL_PAGES = ['home', 'products', 'services', 'book', 'about', 'contact', 'all']
const TRIGGER_TYPES = [
  { value: 'delay', label: 'After delay' },
  { value: 'immediate', label: 'Immediately' },
  { value: 'scroll', label: 'On scroll (300px)' },
]
const INPUT_TYPES = [
  { value: 'email', label: 'Email', Icon: Mail },
  { value: 'phone', label: 'Phone', Icon: Phone },
  { value: 'text', label: 'Text (open-ended)', Icon: Type },
]
const DESIGN_THEMES = [
  { value: 1, label: 'Minimal Split', desc: 'Text left · Image right · White bg' },
  { value: 2, label: 'Centered Card', desc: 'Image header · Centered content' },
  { value: 3, label: 'Dark Luxury', desc: 'Dark bg · Gold accents · Premium' },
]

const emptyForm: PopupForm = {
  id: null,
  title: '',
  subtitle: '',
  description: '',
  has_offer: false,
  offer_text: '',
  has_countdown: false,
  countdown_end: '',
  cta_text: '',
  cta_url: '',
  has_input: false,
  input_type: 'email',
  input_placeholder: '',
  image_url: '',
  design_theme: 1,
  pages: ['home'],
  trigger_type: 'delay',
  trigger_delay: 3,
  is_active: true,
}

function toLocalDateTimeValue(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5
          ${checked ? 'bg-primary' : 'bg-gray-200'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </div>
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  )
}

export default function AdminPopupsPage() {
  const [items, setItems] = useState<Popup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<PopupForm>({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const f = useCallback(<K extends keyof PopupForm>(k: K, v: PopupForm[K]) => {
    setForm(p => ({ ...p, [k]: v }))
  }, [])

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: e } = await supabase
        .from('popups')
        .select('*')
        .order('created_at', { ascending: false })
      if (e) throw e
      setItems((data || []) as Popup[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load popups')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const openAdd = () => {
    setForm({ ...emptyForm })
    setError('')
    setShowModal(true)
  }

  const openEdit = (p: Popup) => {
    setForm({
      id: p.id,
      title: p.title || '',
      subtitle: p.subtitle || '',
      description: p.description || '',
      has_offer: p.has_offer,
      offer_text: p.offer_text || '',
      has_countdown: p.has_countdown,
      countdown_end: p.countdown_end ? toLocalDateTimeValue(p.countdown_end) : '',
      cta_text: p.cta_text || '',
      cta_url: p.cta_url || '',
      has_input: p.has_input,
      input_type: p.input_type || 'email',
      input_placeholder: p.input_placeholder || '',
      image_url: p.image_url || '',
      design_theme: p.design_theme || 1,
      pages: p.pages || ['home'],
      trigger_type: p.trigger_type || 'delay',
      trigger_delay: p.trigger_delay ?? 3,
      is_active: p.is_active,
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() && !form.cta_text.trim()) {
      setError('At minimum provide a Title or a CTA button text.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: form.title.trim() || null,
        subtitle: form.subtitle.trim() || null,
        description: form.description.trim() || null,
        has_offer: form.has_offer,
        offer_text: form.has_offer ? (form.offer_text.trim() || null) : null,
        has_countdown: form.has_countdown,
        countdown_end: form.has_countdown && form.countdown_end
          ? new Date(form.countdown_end).toISOString() : null,
        cta_text: form.cta_text.trim() || null,
        cta_url: form.cta_url.trim() || null,
        has_input: form.has_input,
        input_type: form.input_type,
        input_placeholder: form.has_input ? (form.input_placeholder.trim() || null) : null,
        image_url: form.image_url.trim() || null,
        design_theme: form.design_theme,
        pages: form.pages.length > 0 ? form.pages : ['home'],
        trigger_type: form.trigger_type,
        trigger_delay: form.trigger_delay,
        is_active: form.is_active,
      }
      if (form.id) {
        const { error: e } = await supabase.from('popups').update(payload).eq('id', form.id)
        if (e) throw e
        setInfo('Popup updated')
      } else {
        const { error: e } = await supabase.from('popups').insert(payload)
        if (e) throw e
        setInfo('Popup created')
      }
      setShowModal(false)
      fetchItems()
      setTimeout(() => setInfo(''), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save popup')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (p: Popup) => {
    setBusyId(p.id)
    try {
      await supabase.from('popups').update({ is_active: !p.is_active }).eq('id', p.id)
      setItems(prev => prev.map(x => x.id === p.id ? { ...x, is_active: !x.is_active } : x))
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (p: Popup) => {
    if (!confirm(`Delete popup "${p.title || 'Untitled'}"? This cannot be undone.`)) return
    setBusyId(p.id)
    try {
      const { error: e } = await supabase.from('popups').delete().eq('id', p.id)
      if (e) throw e
      setItems(prev => prev.filter(x => x.id !== p.id))
    } finally {
      setBusyId(null)
    }
  }

  const togglePage = (page: string) => {
    if (page === 'all') {
      f('pages', form.pages.includes('all') ? [] : ['all'])
      return
    }
    const next = form.pages.filter(p => p !== 'all')
    f('pages', next.includes(page) ? next.filter(p => p !== page) : [...next, page])
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Popup Ads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${items.length} total · ${items.filter(i => i.is_active).length} active`}
          </p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-primary-dark transition-all">
          <Plus size={16} /> Add Popup
        </button>
      </div>

      {error && !showModal && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}
        </div>
      )}
      {info && (
        <div className="mb-6 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">{info}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Popup</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Theme</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Pages</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Trigger</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading…</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No popups yet. Add one!</td></tr>
              ) : items.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-charcoal">{p.title || <span className="text-gray-400 italic">No title</span>}</div>
                    {p.subtitle && <div className="text-xs text-gray-400 mt-0.5">{p.subtitle}</div>}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {p.has_offer && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">Offer</span>}
                      {p.has_countdown && <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5"><Clock size={9} /> Timer</span>}
                      {p.has_input && <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full font-medium">Input</span>}
                      {p.image_url && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5"><ImageIcon size={9} /> Image</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {DESIGN_THEMES.find(t => t.value === p.design_theme)?.label ?? `Theme ${p.design_theme}`}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(p.pages || []).map(pg => (
                        <span key={pg} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded capitalize">{pg}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 capitalize text-xs">
                    {p.trigger_type === 'delay' ? `After ${p.trigger_delay}s` : p.trigger_type.replace('_', ' ')}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(p)} disabled={busyId === p.id}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${p.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button onClick={() => openEdit(p)} disabled={busyId === p.id}
                        className="inline-flex items-center gap-1 text-charcoal hover:text-primary text-sm">
                        <Pencil size={14} /> Edit
                      </button>
                      <button onClick={() => remove(p)} disabled={busyId === p.id}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm disabled:opacity-50">
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

      {/* ─── Edit / Add Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-charcoal">
                {form.id ? 'Edit Popup' : 'New Popup'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" /> {error}
                </div>
              )}

              {/* ── Design Theme ── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Design Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {DESIGN_THEMES.map(t => (
                    <button key={t.value} onClick={() => f('design_theme', t.value)}
                      className={`p-3 rounded-xl border text-left transition-all
                        ${form.design_theme === t.value
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                          : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="font-semibold text-sm text-charcoal mb-0.5">{t.label}</div>
                      <div className="text-[11px] text-gray-400">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Content ── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Content</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Title</label>
                    <input type="text" value={form.title} onChange={e => f('title', e.target.value)}
                      className={inputCls} placeholder="Join the club" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Subtitle</label>
                      <input type="text" value={form.subtitle} onChange={e => f('subtitle', e.target.value)}
                        className={inputCls} placeholder="Short tagline" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Image URL</label>
                      <div className="relative">
                        <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={form.image_url} onChange={e => f('image_url', e.target.value)}
                          className={`${inputCls} pl-8`} placeholder="/images/promo.jpg" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                    <textarea value={form.description} onChange={e => f('description', e.target.value)}
                      rows={2} className={`${inputCls} resize-none`}
                      placeholder="A short description shown under the title…" />
                  </div>
                </div>
              </section>

              {/* ── Special Offer ── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Special Offer</h3>
                <ToggleField label="Show special offer badge" checked={form.has_offer} onChange={v => f('has_offer', v)} />
                {form.has_offer && (
                  <input type="text" value={form.offer_text} onChange={e => f('offer_text', e.target.value)}
                    className={`${inputCls} mt-3`} placeholder="25% Off · Limited time" />
                )}
              </section>

              {/* ── Countdown Timer ── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Countdown Timer</h3>
                <ToggleField label="Show countdown timer" checked={form.has_countdown} onChange={v => f('has_countdown', v)} />
                {form.has_countdown && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-charcoal mb-1">Offer ends at</label>
                    <input type="datetime-local" value={form.countdown_end}
                      onChange={e => f('countdown_end', e.target.value)} className={inputCls} />
                  </div>
                )}
              </section>

              {/* ── CTA Button ── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">CTA Button</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Button Text</label>
                    <input type="text" value={form.cta_text} onChange={e => f('cta_text', e.target.value)}
                      className={inputCls} placeholder="Book Now" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Button URL</label>
                    <input type="text" value={form.cta_url} onChange={e => f('cta_url', e.target.value)}
                      className={inputCls} placeholder="/book" />
                  </div>
                </div>
              </section>

              {/* ── Input Field ── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Input Field</h3>
                <ToggleField label="Add an input field to the popup" checked={form.has_input} onChange={v => f('has_input', v)} />
                {form.has_input && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Input type</label>
                      <div className="flex gap-2">
                        {INPUT_TYPES.map(t => (
                          <button key={t.value} onClick={() => f('input_type', t.value)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all
                              ${form.input_type === t.value
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                            <t.Icon size={14} /> {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Placeholder text</label>
                      <input type="text" value={form.input_placeholder} onChange={e => f('input_placeholder', e.target.value)}
                        className={inputCls} placeholder="Enter your email…" />
                    </div>
                  </div>
                )}
              </section>

              {/* ── Display Settings ── */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Display Settings</h3>

                {/* Pages */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-charcoal mb-2">Show on pages</label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_PAGES.map(pg => (
                      <button key={pg} onClick={() => togglePage(pg)}
                        className={`px-3 py-1.5 rounded-xl border text-sm capitalize transition-all
                          ${form.pages.includes(pg)
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        {pg === 'all' ? 'All Pages' : pg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trigger */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Trigger</label>
                    <select value={form.trigger_type} onChange={e => f('trigger_type', e.target.value)}
                      className={`${inputCls} bg-white`}>
                      {TRIGGER_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  {form.trigger_type === 'delay' && (
                    <div>
                      <label className="block text-sm font-medium text-charcoal mb-1">Delay (seconds)</label>
                      <input type="number" min={0} max={60} value={form.trigger_delay}
                        onChange={e => f('trigger_delay', Number(e.target.value))} className={inputCls} />
                    </div>
                  )}
                </div>
              </section>

              {/* ── Active toggle ── */}
              <section>
                <ToggleField label="Active (visible on the website)" checked={form.is_active} onChange={v => f('is_active', v)} />
              </section>

            </div>

            {/* Modal footer */}
            <div className="flex gap-2 justify-end px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
                {saving ? 'Saving…' : (form.id ? 'Save changes' : 'Create popup')}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
