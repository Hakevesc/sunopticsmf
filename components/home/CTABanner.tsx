import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="cta-section">
      <style>{CTA_STYLES}</style>
      <div className="cta-inner">
        <div className="cta-panel text-center">
          {/* Warm gold accent orb — center top */}
          <div className="absolute inset-0 pointer-events-none z-0" style={{
            background: 'radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.04) 35%, transparent 65%)',
            filter: 'blur(50px)',
          }} />
          {/* Warm gold accent orb — bottom right */}
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at 80% 80%, rgba(201,169,110,0.16) 0%, rgba(201,169,110,0.05) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          {/* Warm gold accent orb — top left */}
          <div className="absolute top-0 left-0 w-[400px] h-[400px] pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at 20% 20%, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.03) 45%, transparent 70%)',
            filter: 'blur(55px)',
          }} />

          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="cta-eyebrow">Book Today</p>
            <h2 className="cta-heading">
              Ready for Clearer Vision?
            </h2>
            <p className="cta-subtitle">
              Book your comprehensive eye examination today and discover the
              clarity you deserve.
            </p>
            <Link
              href="/book"
              className="cta-button"
            >
              <Calendar size={18} />
              Book Your Appointment
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

const CTA_STYLES = `
.cta-section {
  position: relative;
  background: #FBF8F3;
  overflow: hidden;
}

.cta-inner {
  position: relative;
  z-index: 2;
  max-width: 1340px;
  margin: 0 auto;
  padding: 56px 40px 96px;
}

.cta-panel {
  position: relative;
  background: linear-gradient(135deg, #010E3D 0%, #011845 40%, #010E3D 100%);
  border-radius: 40px;
  padding: 72px 48px;
  border: 1px solid rgba(201, 169, 110, 0.15);
  box-shadow:
    0 25px 50px -12px rgba(1, 14, 61, 0.4),
    0 0 0 1px rgba(201, 169, 110, 0.06);
  overflow: hidden;
}

.cta-eyebrow {
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #C9A96E;
  margin-bottom: 12px;
}

.cta-heading {
  font-size: clamp(2rem, 4.5vw, 3rem);
  font-weight: 300;
  color: #ffffff;
  letter-spacing: -0.015em;
  line-height: 1.2;
  margin-bottom: 16px;
  font-style: italic;
}

.cta-subtitle {
  font-size: 1.1rem;
  color: rgba(251, 248, 243, 0.8);
  max-width: 520px;
  margin: 0 auto 36px;
  font-weight: 300;
  line-height: 1.7;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #C9A96E;
  color: #ffffff;
  border-radius: 9999px;
  padding: 16px 40px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
}

.cta-button:hover {
  background: #b8963e;
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(201, 169, 110, 0.4), 0 4px 12px rgba(201, 169, 110, 0.2);
}

@media (max-width: 720px) {
  .cta-inner { padding: 40px 20px 64px; }
  .cta-panel { padding: 52px 24px; border-radius: 32px; }
  .cta-button { padding: 14px 32px; font-size: 0.8rem; }
}
`
