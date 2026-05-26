'use client'
import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ScanEye, Glasses, Shield } from 'lucide-react'

const benefits = [
  { icon: <ScanEye size={24} />, title: 'Expert Diagnosis', desc: 'Computerized precision eye testing' },
  { icon: <Glasses size={24} />, title: 'Premium Eyewear', desc: '200+ curated frame collection' },
  { icon: <Shield size={24} />, title: 'Vision Protection', desc: 'Personalized vision solutions' },
]

export function BenefitsStrip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <section className="relative z-30 -mt-12 md:-mt-16 lg:-mt-20 py-0 px-6 lg:px-8">
      <div className="max-w-content mx-auto">
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative overflow-hidden bg-gradient-to-br from-[#06ACE4] via-[#000A30] to-[#000724] 
                     rounded-3xl border border-white/10 shadow-2xl p-8 lg:p-12 
                     grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-8 lg:gap-10 items-center transition-all duration-300"
        >
          {/* Spotlight Effect (radial light fade) */}
          {isHovered && (
            <div
              className="absolute pointer-events-none transition-opacity duration-300 z-0"
              style={{
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(6, 172, 228, 0.15) 0%, rgba(6, 172, 228, 0) 70%)',
                left: `${coords.x - 300}px`,
                top: `${coords.y - 300}px`,
              }}
            />
          )}

          {/* Large gaussian blur light glow - bottom right corner */}
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] pointer-events-none z-0" style={{
            background: 'radial-gradient(circle at 80% 80%, rgba(6,172,228,0.32) 0%, rgba(6,172,228,0.1) 45%, transparent 75%)',
            filter: 'blur(45px)',
          }} />

          {benefits.map((item, i) => (
            <React.Fragment key={i}>
              {/* Vertical divider between items (md+ only) */}
              {i > 0 && (
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative z-10 flex items-start gap-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-400/10 text-sky-300 border border-sky-400/20
                                flex items-center justify-center flex-shrink-0 transition-all duration-300 
                                group-hover:scale-110 group-hover:bg-sky-400/20 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1 transition-colors duration-300 group-hover:text-sky-300">{item.title}</h3>
                  <p className="text-sm text-sky-100/70 transition-colors duration-300 group-hover:text-white">{item.desc}</p>
                </div>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}