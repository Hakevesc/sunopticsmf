'use client'
import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { X, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

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
}

/* ─── Countdown hook ─── */
function useCountdown(end: string | null) {
  const calc = useCallback(() => {
    if (!end) return null
    const diff = Math.max(0, Math.floor((new Date(end).getTime() - Date.now()) / 1000))
    const h = Math.floor(diff / 3600)
    const m = Math.floor((diff % 3600) / 60)
    const s = diff % 60
    return { h, m, s, total: diff }
  }, [end])

  const [parts, setParts] = useState(calc)
  useEffect(() => {
    if (!end) return
    const id = setInterval(() => setParts(calc()), 1000)
    return () => clearInterval(id)
  }, [end, calc])
  return parts
}

/* ─── Shared timer block ─── */
function TimerBlock({ value, label, dark }: { value: number; label: string; dark?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black tabular-nums
        ${dark
          ? 'bg-white/10 text-white border border-white/20'
          : 'bg-[#010E3D] text-white'}`}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest mt-1.5
        ${dark ? 'text-white/50' : 'text-[#010E3D]/50'}`}>
        {label}
      </span>
    </div>
  )
}

function Colon({ dark }: { dark?: boolean }) {
  return (
    <span className={`text-3xl font-black mb-5 ${dark ? 'text-white/30' : 'text-[#010E3D]/30'}`}>:</span>
  )
}

/* ══════════════════════════════════════════════
   THEME 1 — Navy + Cyan  (clean, professional)
══════════════════════════════════════════════ */
function Theme1({ popup, onClose }: { popup: Popup; onClose: () => void }) {
  const timer = useCountdown(popup.has_countdown ? popup.countdown_end : null)
  const [inputVal, setInputVal] = useState('')
  const isTel = popup.cta_url?.startsWith('tel:')

  return (
    <div className="bg-white rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl">

      {/* Header band */}
      <div className="bg-[#010E3D] px-6 pt-7 pb-6 relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <X size={15} />
        </button>

        {popup.has_offer && popup.offer_text && (
          <div className="inline-flex items-center gap-1.5 bg-[#06ACE4] text-white text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4">
            {popup.offer_text}
          </div>
        )}

        {popup.title && (
          <h2 className="text-2xl font-black text-white leading-tight">
            {popup.title}
          </h2>
        )}
        {popup.subtitle && (
          <p className="text-[#06ACE4] font-semibold text-sm mt-1">{popup.subtitle}</p>
        )}
      </div>

      {/* Image */}
      {popup.image_url && (
        <div className="relative h-44 w-full">
          <Image src={popup.image_url} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
        </div>
      )}

      {/* Body */}
      <div className="px-6 pb-7 pt-5 space-y-5">

        {popup.description && (
          <p className="text-sm text-gray-500 leading-relaxed">{popup.description}</p>
        )}

        {/* Big Timer */}
        {popup.has_countdown && timer && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#010E3D]/40 mb-3 text-center">Offer expires in</p>
            <div className="flex items-end justify-center gap-2">
              <TimerBlock value={timer.h} label="hrs" />
              <Colon />
              <TimerBlock value={timer.m} label="min" />
              <Colon />
              <TimerBlock value={timer.s} label="sec" />
            </div>
          </div>
        )}

        {popup.has_input && (
          <input
            type={popup.input_type === 'phone' ? 'tel' : popup.input_type === 'email' ? 'email' : 'text'}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={popup.input_placeholder || 'Enter here…'}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm
                       focus:border-[#06ACE4] focus:ring-2 focus:ring-[#06ACE4]/20 outline-none"
          />
        )}

        {popup.cta_text && (
          <a href={popup.cta_url || '#'} onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-[#06ACE4] hover:bg-[#0594C6] text-white
                       rounded-xl px-6 py-3.5 font-bold text-sm transition-colors shadow-lg shadow-[#06ACE4]/30">
            {isTel && <Phone size={15} />}
            {popup.cta_text}
          </a>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   THEME 2 — Cyan Gradient  (vibrant, energetic)
══════════════════════════════════════════════ */
function Theme2({ popup, onClose }: { popup: Popup; onClose: () => void }) {
  const timer = useCountdown(popup.has_countdown ? popup.countdown_end : null)
  const [inputVal, setInputVal] = useState('')
  const isTel = popup.cta_url?.startsWith('tel:')

  return (
    <div className="rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl"
      style={{ background: 'linear-gradient(160deg,#010E3D 0%,#013a8c 60%,#06ACE4 100%)' }}>

      <div className="px-6 pt-7 pb-0 relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white hover:bg-white/25 transition-colors">
          <X size={15} />
        </button>

        {popup.has_offer && popup.offer_text && (
          <div className="inline-flex items-center bg-white/15 backdrop-blur text-white text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full mb-4 border border-white/20">
            {popup.offer_text}
          </div>
        )}

        {popup.title && (
          <h2 className="text-2xl font-black text-white leading-tight">{popup.title}</h2>
        )}
        {popup.subtitle && (
          <p className="text-[#38BDE8] font-semibold text-sm mt-1">{popup.subtitle}</p>
        )}
        {popup.description && (
          <p className="text-white/60 text-sm mt-2 leading-relaxed">{popup.description}</p>
        )}
      </div>

      {/* Image with gradient blend */}
      {popup.image_url && (
        <div className="relative h-44 w-full mt-5">
          <Image src={popup.image_url} alt="" fill className="object-cover opacity-40" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, #013a8c 100%)' }} />
        </div>
      )}

      {/* Big Timer */}
      {popup.has_countdown && timer && (
        <div className={popup.image_url ? 'px-6 pb-2 -mt-4 relative z-10' : 'px-6 pb-2 pt-5'}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3 text-center">Offer expires in</p>
          <div className="flex items-end justify-center gap-2">
            <TimerBlock value={timer.h} label="hrs" dark />
            <Colon dark />
            <TimerBlock value={timer.m} label="min" dark />
            <Colon dark />
            <TimerBlock value={timer.s} label="sec" dark />
          </div>
        </div>
      )}

      <div className="px-6 pb-7 pt-5 space-y-3">
        {popup.has_input && (
          <input
            type={popup.input_type === 'phone' ? 'tel' : popup.input_type === 'email' ? 'email' : 'text'}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={popup.input_placeholder || 'Enter here…'}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm
                       placeholder-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/10 outline-none"
          />
        )}

        {popup.cta_text && (
          <a href={popup.cta_url || '#'} onClick={onClose}
            className="flex items-center justify-center gap-2 w-full bg-white text-[#010E3D]
                       rounded-xl px-6 py-3.5 font-black text-sm transition-all hover:bg-[#eefbff] shadow-lg">
            {isTel && <Phone size={15} />}
            {popup.cta_text}
          </a>
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   THEME 3 — Navy Card  (minimal, premium, trust)
══════════════════════════════════════════════ */
function Theme3({ popup, onClose }: { popup: Popup; onClose: () => void }) {
  const timer = useCountdown(popup.has_countdown ? popup.countdown_end : null)
  const [inputVal, setInputVal] = useState('')
  const isTel = popup.cta_url?.startsWith('tel:')

  return (
    <div className="bg-[#010E3D] rounded-3xl overflow-hidden w-full max-w-sm shadow-2xl border border-white/10">

      {/* Image top */}
      {popup.image_url && (
        <div className="relative h-44 w-full">
          <Image src={popup.image_url} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#010E3D]" />
        </div>
      )}

      <div className="px-6 pt-6 pb-7 relative space-y-5">
        <button onClick={onClose}
          className="absolute top-0 right-5 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <X size={15} />
        </button>

        {/* Offer pill */}
        {popup.has_offer && popup.offer_text && (
          <div className="inline-flex items-center bg-[#06ACE4]/20 text-[#06ACE4] text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full border border-[#06ACE4]/30">
            {popup.offer_text}
          </div>
        )}

        {/* Text */}
        <div>
          {popup.title && (
            <h2 className="text-2xl font-black text-white leading-tight">{popup.title}</h2>
          )}
          {popup.subtitle && (
            <p className="text-[#06ACE4] font-semibold text-sm mt-1">{popup.subtitle}</p>
          )}
          {popup.description && (
            <p className="text-white/55 text-sm mt-2 leading-relaxed">{popup.description}</p>
          )}
        </div>

        {/* Big Timer */}
        {popup.has_countdown && timer && (
          <div className="bg-white/5 rounded-2xl px-4 py-4 border border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/35 mb-3 text-center">Offer expires in</p>
            <div className="flex items-end justify-center gap-2">
              <TimerBlock value={timer.h} label="hrs" dark />
              <Colon dark />
              <TimerBlock value={timer.m} label="min" dark />
              <Colon dark />
              <TimerBlock value={timer.s} label="sec" dark />
            </div>
          </div>
        )}

        {/* Input */}
        {popup.has_input && (
          <input
            type={popup.input_type === 'phone' ? 'tel' : popup.input_type === 'email' ? 'email' : 'text'}
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder={popup.input_placeholder || 'Enter here…'}
            className="w-full px-4 py-3 rounded-xl bg-white/8 border border-white/15 text-white text-sm
                       placeholder-white/35 focus:border-[#06ACE4]/60 focus:ring-2 focus:ring-[#06ACE4]/15 outline-none"
          />
        )}

        {/* CTA */}
        {popup.cta_text && (
          <a href={popup.cta_url || '#'} onClick={onClose}
            className="flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 font-bold text-sm transition-all
                       bg-[#06ACE4] hover:bg-[#38BDE8] text-white shadow-lg shadow-[#06ACE4]/25">
            {isTel && <Phone size={15} />}
            {popup.cta_text}
          </a>
        )}
      </div>
    </div>
  )
}

/* ─── Route → slug ─── */
function pageSlug(pathname: string): string {
  const seg = pathname.replace(/^\/(en|am)/, '').replace(/^\/+/, '') || 'home'
  return seg.split('/')[0] || 'home'
}

const THEME_MAP: Record<number, React.ComponentType<{ popup: Popup; onClose: () => void }>> = {
  1: Theme1,
  2: Theme2,
  3: Theme3,
}

/* ─── Main export ─── */
export function PopupAd() {
  const pathname = usePathname()
  const [popup, setPopup] = useState<Popup | null>(null)
  const [visible, setVisible] = useState(false)

  const fetchPopup = useCallback(async (slug: string) => {
    const { data } = await supabase
      .from('popups')
      .select('*')
      .eq('is_active', true)
      .or(`pages.cs.{${slug}},pages.cs.{all}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    return data as Popup | null
  }, [])

  useEffect(() => {
    const slug = pageSlug(pathname)
    let cancelled = false
    let timerId: ReturnType<typeof setTimeout>

    fetchPopup(slug).then(data => {
      if (cancelled || !data) return
      if (sessionStorage.getItem(`popup_dismissed_${data.id}`)) return
      setPopup(data)

      if (data.trigger_type === 'immediate') {
        setVisible(true)
      } else if (data.trigger_type === 'scroll') {
        const onScroll = () => {
          if (window.scrollY > 300) { setVisible(true); window.removeEventListener('scroll', onScroll) }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
      } else {
        timerId = setTimeout(() => setVisible(true), (data.trigger_delay ?? 3) * 1000)
      }
    })

    return () => { cancelled = true; clearTimeout(timerId) }
  }, [pathname, fetchPopup])

  const handleClose = () => {
    if (popup) sessionStorage.setItem(`popup_dismissed_${popup.id}`, '1')
    setVisible(false)
  }

  if (!popup || !visible) return null
  const ThemeComponent = THEME_MAP[popup.design_theme] ?? Theme1

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#010E3D]/70 backdrop-blur-md">
      <div className="animate-[fadeInUp_0.35s_cubic-bezier(0.16,1,0.3,1)]">
        <ThemeComponent popup={popup} onClose={handleClose} />
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  )
}
