'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Glasses, ShieldCheck } from 'lucide-react'

const benefits = [
  {
    icon: Eye,
    title: 'Expert Eye Care',
    desc: 'Computerized precision diagnostics',
  },
  {
    icon: Glasses,
    title: 'Premium Eyewear',
    desc: '200+ curated designer frames',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Results',
    desc: '15+ years of clinical excellence',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

export function BenefitsStrip({ isHeroEmbed = false }: { isHeroEmbed?: boolean }) {
  return (
    <section className={`relative z-30 px-6 lg:px-8 ${isHeroEmbed ? '' : '-mt-10 md:-mt-16 lg:-mt-20'}`}>
      <div className="max-w-content mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={`relative overflow-hidden bg-[#FBF8F3]/90 backdrop-blur-md rounded-3xl 
                     border border-[#06ACE4]/20 shadow-[0_15px_45px_rgba(6,172,228,0.12)]
                     grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 items-center
                     ${isHeroEmbed ? 'p-5 lg:p-6' : 'p-8 lg:p-10'}`}
        >
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon
            return (
              <React.Fragment key={i}>
                <motion.div
                  variants={itemVariants}
                  className="relative z-10 flex items-start gap-5 group cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#06ACE4]/10 text-[#06ACE4] border border-[#06ACE4]/25
                                  flex items-center justify-center flex-shrink-0 transition-all duration-400 
                                  group-hover:scale-110 group-hover:bg-[#06ACE4] group-hover:text-white
                                  group-hover:shadow-[0_8px_20px_rgba(6,172,228,0.3)]"
                  >
                    <Icon size={26} className="transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans text-lg font-bold text-[#010E3D] mb-1.5 transition-colors duration-300 group-hover:text-[#06ACE4]">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-[#010E3D]/60 font-sans leading-relaxed">
                      {benefit.desc}
                    </p>
                  </div>
                </motion.div>
                
                {/* Visual vertical divider on desktop, horizontal on mobile if needed (using borders) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -translate-y-1/2 w-px h-12 bg-[#06ACE4]/15"
                       style={{ left: `${(i + 1) * 33.33}%` }} 
                  />
                )}
              </React.Fragment>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}