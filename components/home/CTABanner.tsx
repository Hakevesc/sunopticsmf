import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function CTABanner() {
  return (
    <section className="cta-section">
      <style>{CTA_STYLES}</style>
      <div className="cta-inner">
        <div className="cta-panel text-center">
          {/* Blurred gaussian light orb - center */}
          <div className="absolute inset-0 pointer-events-none z-0" style={{
            background: 'radial-gradient(ellipse at 50% 60%, rgba(6,172,228,0.10) 0%, rgba(1,14,61,0.05) 35%, transparent 65%)',
            filter: 'blur(50px)',
          }} />
          {/* Blurred gaussian light orb - bottom right corner */}
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at 80% 80%, rgba(6,172,228,0.18) 0%, rgba(6,172,228,0.06) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }} />

          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="pretitle text-sky-300 mb-2">Book Today</p>
            <h2 className="text-display-md text-white mb-4">
              Ready for Clearer Vision?
            </h2>
            <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto font-light leading-relaxed">
              Book your comprehensive eye examination today and discover the
              clarity you deserve.
            </p>
            <Link 
              href="/book"
              className="inline-flex items-center gap-2 bg-[#06ACE4] text-white rounded-full px-10 py-4 text-sm font-medium uppercase tracking-wider hover:bg-[#0592c2] hover:shadow-[0_8px_24px_rgba(6,172,228,0.35)] transform hover:-translate-y-0.5 transition-all duration-300"
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
  background: radial-gradient(circle at 10% 30%, #ffffff 0%, #f3f6fc 100%);
  overflow: hidden;
}
.cta-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(6,172,228,0.06) 1.5px, transparent 1.5px);
  background-size: 32px 32px;
  pointer-events: none;
  z-index: 0;
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
  background: linear-gradient(135deg, #010e3d 0%, #01174a 40%, #010e3d 100%);
  border-radius: 40px;
  padding: 60px 48px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 25px 50px -12px rgba(1, 14, 61, 0.35),
    0 0 0 1px rgba(6, 172, 228, 0.05);
  overflow: hidden;
}

@media (max-width: 720px) {
  .cta-inner { padding: 40px 20px 64px; }
  .cta-panel { padding: 44px 24px; border-radius: 32px; }
}
`

