'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, Heart, Award } from 'lucide-react'
import { EditorialSplit } from '@/components/home/EditorialSplit'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export default function AboutPage() {
  return (
    <>
      {/* Premium Hero Section */}
      

      {/* Editorial Split Section */}
      <EditorialSplit isPage={true} />

      {/* Core Values Section */}
      <section id="services-list" className="bg-[#eefbff] py-16 md:py-[120px] relative">
  <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }} className="mb-14 text-center md:mb-16">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#06ACE4]">What We Offer</p>
      <h2 className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-4xl font-light tracking-tight text-[#1a1a2e] md:text-5xl">
        <span className="text-white">Exceptional Eye Care</span>
        <span className="inline-block rounded-full bg-gradient-to-r from-[#06ACE4] to-[#38BDE8] px-5 py-1.5 text-[1em] font-normal tracking-wide text-white leading-tight">Services</span>
      </h2>
      <p className="text-lg md:text-xl text-[#1a1a2e] max-w-2xl mx-auto mb-8 mt-6">Our comprehensive suite blends cutting‑edge technology with bespoke luxury, ensuring every visit delivers precise vision care and a premium experience.</p>
    </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: 'Clinical Precision',
                desc: 'We utilize state-of-the-art computerized diagnostic equipment to deliver the most accurate refractive error assessments.',
              },
              {
                icon: Award,
                title: 'Uncompromised Quality',
                desc: 'Every single frame and lens in our showroom is selected for exceptional quality, durability, and luxury appeal.',
              },
              {
                icon: Heart,
                title: 'Patient-First Focus',
                desc: 'We pride ourselves on offering warm, boutique hospitality and highly individualized care to every member of your family.',
              },
            ].map((value, i) => {
              const Icon = value.icon
              return (
                <div
                  key={i}
                  className="bg-white border border-[#06ACE4]/12 rounded-2xl p-8 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(6,172,228,0.14)]"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#06ACE4]/10 text-[#06ACE4] flex items-center justify-center mb-6">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>
                  <h3 className="text-xl font-semibold text-[#010E3D] mb-3">{value.title}</h3>
                  <p className="text-[#010E3D]/65 text-sm leading-relaxed">{value.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}