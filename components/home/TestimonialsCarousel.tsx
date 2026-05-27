'use client'
import { useEffect, useRef, useState } from 'react'
import { ExternalLink, BadgeCheck } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { supabase } from '@/lib/supabase'

interface Review {
  id: string
  name: string
  rating: string
  date: string
  text: string
}

const INTERVAL_MS = 4200
const FADE_MS = 350

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #06ACE4 0%, #010E3D 100%)',
  'linear-gradient(135deg, #38BDE8 0%, #1E3A5F 100%)',
  'linear-gradient(135deg, #0594C6 0%, #0A1F40 100%)',
  'linear-gradient(135deg, #2EC4F0 0%, #152E55 100%)',
  'linear-gradient(135deg, #048ABC 0%, #010E3D 100%)',
  'linear-gradient(135deg, #06ACE4 0%, #2C1810 100%)',
  'linear-gradient(135deg, #38BDE8 0%, #1A0E2E 100%)',
  'linear-gradient(135deg, #28B4E0 0%, #0D2137 100%)',
  'linear-gradient(135deg, #4CCCF4 0%, #010E3D 100%)',
  'linear-gradient(135deg, #06ACE4 0%, #1C2D48 100%)',
]

function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// 5 visible slots + hidden queue:
//   0 = far-top, 1 = top, 2 = center, 3 = bottom, 4 = far-bottom, 5+ = hidden
function slotOf(reviewIdx: number, target: number, total: number): number {
  if (total === 0) return 5
  const diff = (reviewIdx - target + total) % total
  if (diff === 0) return 2
  if (diff === 1) return 1
  if (diff === 2) return 0
  if (diff === total - 1) return 3
  if (diff === total - 2) return 4
  return diff + 3
}

type Pos = 'far-top' | 'top' | 'center' | 'bottom' | 'far-bottom' | 'hidden'
function posName(slot: number): Pos {
  if (slot === 0) return 'far-top'
  if (slot === 1) return 'top'
  if (slot === 2) return 'center'
  if (slot === 3) return 'bottom'
  if (slot === 4) return 'far-bottom'
  return 'hidden'
}

export function TestimonialsCarousel() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [centerIdx, setCenterIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('testimonials')
        .select('id, author_name, rating, review_text_en, created_at, is_featured')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (!data) return
      const mapped: Review[] = data.map((r) => ({
        id: r.id,
        name: r.author_name,
        rating: Number(r.rating ?? 5).toFixed(1),
        date: r.created_at
          ? formatDistanceToNow(new Date(r.created_at), { addSuffix: true })
          : '',
        text: r.review_text_en,
      }))
      setReviews(mapped)
    }
    load()
  }, [])

  const N = reviews.length
  const featured = N > 0 ? reviews[centerIdx] : null

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const triggerFade = () => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
    setFading(true)
    fadeTimeoutRef.current = setTimeout(() => setFading(false), FADE_MS)
  }

  const transitionTo = (next: number) => {
    if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current)
    setFading(true)
    fadeTimeoutRef.current = setTimeout(() => {
      setCenterIdx(next)
      setFading(false)
      fadeTimeoutRef.current = null
    }, FADE_MS)
  }

  const advanceTo = (target: number) => {
    if (target === centerIdx) return
    transitionTo(target)
  }

  useEffect(() => {
    if (paused || N === 0) {
      clearTimer()
      return
    }
    timerRef.current = setInterval(() => {
      setCenterIdx(prev => (prev + 1) % N)
      triggerFade()
    }, INTERVAL_MS)
    return clearTimer
  }, [paused, N])

  useEffect(() => {
    const onVis = () => setPaused(document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <section className="testimonials-section">
      <style>{TESTIMONIAL_STYLES}</style>

      <div className="tst-inner">
        {/* HEADER */}
        <div className="tst-title">
          <div className="tst-heading">
            <span className="tst-heading-dark">What Our</span>
            <span className="tst-heading-box">Customers Say</span>
          </div>
          <p className="tst-subtitle">
            Real stories from customers who trust SunOptics — Meskel Flower for their eye care and eyewear,
            shared directly through verified Google Reviews.
          </p>
        </div>

        {/* GRID */}
        <div className="tst-grid">
          {/* LEFT: arc */}
          <div className="tst-arc-wrap">
            <div className="tst-arc-area">
              <svg className="tst-arc-svg" viewBox="0 0 420 560" preserveAspectRatio="xMidYMid meet">
                <path className="tst-arc-path" d="M 80 80 Q 360 280 80 480" />
              </svg>

              {/* Pause zone covers only the active (center) slot */}
              <div
                className="tst-pause-zone"
                aria-hidden="true"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
              />

              {reviews.map((r, i) => {
                const slot = slotOf(i, centerIdx, N)
                const pos = posName(slot)
                const isFar = pos === 'far-top' || pos === 'far-bottom'
                return (
                  <button
                    key={r.id}
                    type="button"
                    className="tst-card"
                    data-pos={pos}
                    aria-label={`Show review from ${r.name}`}
                    aria-hidden={pos === 'hidden'}
                    onClick={() => advanceTo(i)}
                    tabIndex={pos === 'hidden' ? -1 : 0}
                  >
                    <div
                      className="tst-card-avatar"
                      style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}
                    >
                      <span className="tst-card-initials">{initials(r.name)}</span>
                    </div>
                    {!isFar && (
                      <div className="tst-card-info">
                        <div className="tst-card-name">{r.name}</div>
                        <div className="tst-card-rating">
                          <svg className="tst-star" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 .5l3.7 7.5 8.3 1.2-6 5.8 1.4 8.3L12 19.4 4.6 23.3 6 15 0 9.2l8.3-1.2L12 .5z" />
                          </svg>
                          <span>
                            {r.rating} · {r.date}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* RIGHT: quote panel */}
          <div className="flex flex-col gap-6 w-full">
            <div className="tst-quote-panel">
              {/* Oversized background quote glyph */}
              <span className="tst-quote-bg" aria-hidden="true">&ldquo;</span>

              {/* Top right: Verified Google Review + blue verified badge */}
              <div className="tst-verified-row">
                <div className="tst-google-badge">
                  <div className="tst-google-icon">
                    <svg viewBox="0 0 48 48" aria-hidden="true">
                      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
                      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.4 6.3 14.7z" />
                      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z" />
                      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.3-.4-3.5z" />
                    </svg>
                  </div>
                  <span className="tst-badge-text">Verified Google Review</span>
                </div>
                <BadgeCheck className="tst-verified-icon" aria-label="Verified" />
              </div>

              {/* Quote body */}
              <div className={`tst-quote-text${fading ? ' tst-fade-out' : ''}`}>
                {featured ? featured.text : 'Loading reviews…'}
              </div>
            </div>

            {/* View All Button below the box */}
            <div className="flex justify-start md:justify-end">
              <a
                href="https://share.google/DS7L0KzU3z3MTn8M1"
                target="_blank"
                rel="noopener noreferrer"
                className="tst-view-all-outside"
              >
                <span>View All Google Reviews</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const TESTIMONIAL_STYLES = `
.testimonials-section {
  position: relative;
  background: #eefbff;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.testimonials-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(6,172,228,0.08) 1.5px, transparent 1.5px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
}
.tst-inner {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1340px;
  margin: 0 auto;
  padding: 56px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 56px;
}

/* HEADER */
.tst-title { text-align: center; max-width: 820px; margin: 0 auto; }
.tst-heading {
  font-size: clamp(1.5rem, 2.6vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 32px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: baseline;
  gap: 10px;
  white-space: nowrap;
  line-height: 1.15;
}
.tst-heading-dark { color: #010E3D; font-weight: 300; }
.tst-heading-box {
  display: inline-block;
  background: linear-gradient(135deg, #06ACE4 0%, #38BDE8 100%);
  color: #ffffff;
  padding: 0.18em 0.8em;
  border-radius: 9999px;
  font-weight: 400;
  font-style: normal;
  line-height: 1.3;
  font-size: 1em;
  letter-spacing: -0.01em;
}
.tst-subtitle {
  font-size: 1rem;
  line-height: 1.6;
  color: #010E3D;
  max-width: 620px;
  margin: 0 auto;
  font-weight: 450;
  opacity: 0.8;
}

/* GRID */
.tst-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.tst-arc-wrap { display: flex; justify-content: center; }

/* ARC — taller to accommodate far-top / far-bottom horizon cards */
.tst-arc-area {
  position: relative;
  width: 420px;
  height: 560px;
}
.tst-arc-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}
.tst-arc-path {
  fill: none;
  stroke: rgba(6, 172, 228, 0.22);
  stroke-width: 1.5;
  stroke-dasharray: 3 6;
  stroke-linecap: round;
}

/* Pause zone over the active (center) card slot only */
.tst-pause-zone {
  position: absolute;
  top: 220px;
  left: 140px;
  width: 300px;
  height: 150px;
  z-index: 10;
  cursor: pointer;
  background: transparent;
}

.tst-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 18px;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  font: inherit;
  color: inherit;
  cursor: pointer;
  user-select: none;
  transition:
    top 0.85s cubic-bezier(0.65, 0, 0.35, 1),
    left 0.85s cubic-bezier(0.65, 0, 0.35, 1),
    opacity 0.6s ease,
    filter 0.6s ease;
  will-change: top, left, opacity;
}
.tst-card:focus-visible {
  outline: 2px solid #06ACE4;
  outline-offset: 4px;
  border-radius: 12px;
}

.tst-card-avatar {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 3px solid #eefbff;
  box-shadow:
    0 4px 12px rgba(1, 14, 61, 0.08),
    0 0 0 1px rgba(6, 172, 228, 0.1);
  transition: all 0.85s cubic-bezier(0.65, 0, 0.35, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tst-card-initials {
  color: #ffffff;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgba(0,0,0,0.15);
  transition: font-size 0.85s cubic-bezier(0.65, 0, 0.35, 1);
}

.tst-card-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: all 0.85s cubic-bezier(0.65, 0, 0.35, 1);
}
.tst-card-name {
  color: #010E3D;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
  transition: font-size 0.85s cubic-bezier(0.65, 0, 0.35, 1), font-weight 0.5s ease;
  white-space: nowrap;
}
.tst-card-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #010E3D;
  font-weight: 500;
  opacity: 0.8;
  transition: font-size 0.85s cubic-bezier(0.65, 0, 0.35, 1);
  white-space: nowrap;
}
.tst-star {
  fill: #06ACE4;
  flex-shrink: 0;
  transition: width 0.85s cubic-bezier(0.65, 0, 0.35, 1), height 0.85s cubic-bezier(0.65, 0, 0.35, 1);
}

/* FAR-TOP — horizon, avatar only, very small + faded */
.tst-card[data-pos="far-top"] {
  top: 8px;
  left: 138px;
  opacity: 0.25;
  filter: blur(0.5px);
  z-index: 1;
  pointer-events: none;
}
.tst-card[data-pos="far-top"] .tst-card-avatar { width: 36px; height: 36px; border-width: 2px; }
.tst-card[data-pos="far-top"] .tst-card-initials { font-size: 0.7rem; }

/* TOP */
.tst-card[data-pos="top"] { top: 76px; left: 52px; opacity: 0.72; z-index: 2; }
.tst-card[data-pos="top"] .tst-card-avatar { width: 58px; height: 58px; }
.tst-card[data-pos="top"] .tst-card-initials { font-size: 1.1rem; }
.tst-card[data-pos="top"] .tst-card-name { font-size: 0.95rem; font-weight: 600; }
.tst-card[data-pos="top"] .tst-card-rating { font-size: 0.75rem; }
.tst-card[data-pos="top"] .tst-star { width: 12px; height: 12px; }

/* CENTER */
.tst-card[data-pos="center"] { top: 232px; left: 158px; opacity: 1; z-index: 5; }
.tst-card[data-pos="center"] .tst-card-avatar {
  width: 100px;
  height: 100px;
  border-width: 4px;
  border-color: #eefbff;
  box-shadow:
    0 14px 36px rgba(6, 172, 228, 0.22),
    0 0 0 1px rgba(6, 172, 228, 0.15),
    0 0 0 9px rgba(6, 172, 228, 0.06);
}
.tst-card[data-pos="center"] .tst-card-initials { font-size: 2rem; }
.tst-card[data-pos="center"] .tst-card-name {
  font-size: 1.55rem;
  font-weight: 700;
  background: linear-gradient(125deg, #010E3D, #1C3054);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
.tst-card[data-pos="center"] .tst-card-rating { font-size: 1rem; }
.tst-card[data-pos="center"] .tst-star { width: 18px; height: 18px; }

.tst-card[data-pos="center"] .tst-card-avatar::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1.5px solid rgba(6, 172, 228, 0.35);
  animation: tstRingPulse 2.6s ease-in-out infinite;
}
@keyframes tstRingPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%      { transform: scale(1.08); opacity: 0; }
}

/* BOTTOM */
.tst-card[data-pos="bottom"] { top: 442px; left: 52px; opacity: 0.72; z-index: 2; }
.tst-card[data-pos="bottom"] .tst-card-avatar { width: 58px; height: 58px; }
.tst-card[data-pos="bottom"] .tst-card-initials { font-size: 1.1rem; }
.tst-card[data-pos="bottom"] .tst-card-name { font-size: 0.95rem; font-weight: 600; }
.tst-card[data-pos="bottom"] .tst-card-rating { font-size: 0.75rem; }
.tst-card[data-pos="bottom"] .tst-star { width: 12px; height: 12px; }

/* FAR-BOTTOM */
.tst-card[data-pos="far-bottom"] {
  top: 516px;
  left: 138px;
  opacity: 0.25;
  filter: blur(0.5px);
  z-index: 1;
  pointer-events: none;
}
.tst-card[data-pos="far-bottom"] .tst-card-avatar { width: 36px; height: 36px; border-width: 2px; }
.tst-card[data-pos="far-bottom"] .tst-card-initials { font-size: 0.7rem; }

/* HIDDEN — parked at far-bottom invisibly */
.tst-card[data-pos="hidden"] {
  top: 516px;
  left: 138px;
  opacity: 0;
  pointer-events: none;
  z-index: 0;
}
.tst-card[data-pos="hidden"] .tst-card-avatar { width: 36px; height: 36px; }
.tst-card[data-pos="hidden"] .tst-card-initials { font-size: 0.7rem; }

/* QUOTE PANEL */
.tst-quote-panel {
  position: relative;
  background: linear-gradient(135deg, #06ACE4 0%, #1C3054 40%, #010E3D 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 36px;
  padding: 32px 40px;
  border: 1px solid rgba(6, 172, 228, 0.15);
  box-shadow:
    0 25px 45px -12px rgba(1, 14, 61, 0.35),
    0 0 0 1px rgba(6, 172, 228, 0.08);
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Oversized background quote glyph */
.tst-quote-bg {
  position: absolute;
  top: -60px;
  left: 0;
  font-family: var(--font-sans), sans-serif;
  font-size: 22rem;
  font-weight: 700;
  line-height: 1;
  color: rgba(255, 255, 255, 0.07);
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* Top right: Verified Google Review */
.tst-verified-row {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.tst-google-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  padding: 8px 18px 8px 14px;
  border-radius: 100px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0,0,0,0.04);
}
.tst-google-icon { width: 20px; height: 20px; }
.tst-google-icon svg { width: 100%; height: 100%; }
.tst-badge-text {
  font-weight: 600;
  color: #010e3d;
  letter-spacing: -0.01em;
  font-size: 0.8rem;
  white-space: nowrap;
}
.tst-verified-icon {
  width: 28px;
  height: 28px;
  color: #ffffff;
  fill: #3B82F6;
  stroke: #ffffff;
  stroke-width: 2;
  filter: drop-shadow(0 4px 10px rgba(59, 130, 246, 0.35));
  flex-shrink: 0;
}

/* Quote body */
.tst-quote-text {
  position: relative;
  z-index: 1;
  font-size: 1.25rem;
  line-height: 1.6;
  font-weight: 400;
  color: #ffffff;
  margin: 6px 0 20px;
  min-height: 5rem;
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.tst-quote-text.tst-fade-out {
  opacity: 0;
  transform: translateY(8px);
}

/* View All Google Reviews outside box */
.tst-view-all-outside {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #06ACE4;
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.01em;
  padding: 10px 24px;
  border-radius: 999px;
  border: 1px solid rgba(6, 172, 228, 0.35);
  background: transparent;
  transition: all 0.3s ease;
}
.tst-view-all-outside:hover {
  background: #06ACE4;
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(6, 172, 228, 0.3);
  transform: translateY(-1.5px);
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .tst-grid {
    grid-template-columns: 1fr;
    gap: 50px;
    max-width: 620px;
    justify-items: center;
  }
  .testimonials-section { min-height: auto; }
  .tst-quote-panel { max-width: 600px; width: 100%; }
}

@media (max-width: 600px) {
  .tst-heading {
    flex-wrap: wrap;
    white-space: normal;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
  }
  .tst-inner { padding: 48px 20px; gap: 40px; }

  .tst-arc-area { width: 340px; height: 500px; }
  .tst-pause-zone { top: 198px; left: 116px; width: 200px; height: 130px; }
  .tst-card[data-pos="far-top"]    { top: 8px;   left: 118px; }
  .tst-card[data-pos="top"]        { top: 64px;  left: 28px; }
  .tst-card[data-pos="center"]     { top: 198px; left: 116px; }
  .tst-card[data-pos="bottom"]     { top: 394px; left: 28px; }
  .tst-card[data-pos="far-bottom"] { top: 460px; left: 118px; }
  .tst-card[data-pos="hidden"]     { top: 460px; left: 118px; }
  .tst-card[data-pos="center"] .tst-card-avatar { width: 86px; height: 86px; }
  .tst-card[data-pos="center"] .tst-card-initials { font-size: 1.65rem; }
  .tst-card[data-pos="center"] .tst-card-name { font-size: 1.2rem; }
  .tst-card[data-pos="top"] .tst-card-avatar,
  .tst-card[data-pos="bottom"] .tst-card-avatar { width: 52px; height: 52px; }
  .tst-card[data-pos="top"] .tst-card-initials,
  .tst-card[data-pos="bottom"] .tst-card-initials { font-size: 1rem; }
  .tst-card[data-pos="far-top"] .tst-card-avatar,
  .tst-card[data-pos="far-bottom"] .tst-card-avatar,
  .tst-card[data-pos="hidden"] .tst-card-avatar { width: 30px; height: 30px; }

  .tst-quote-panel { padding: 20px 22px; border-radius: 28px; }
  .tst-quote-bg { font-size: 16rem; top: -40px; }
  .tst-quote-text { font-size: 1.05rem; min-height: 6rem; }
  .tst-verified-row { gap: 8px; }
  .tst-verified-icon { width: 24px; height: 24px; }
}
`
