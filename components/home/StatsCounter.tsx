'use client'
import { motion } from 'framer-motion'
import { SmoothCounter } from '@/components/ui/SmoothCounter'

const stats = [
  { key: 'years_excellence', value: 15, label: 'Years of Excellence', suffix: '+' },
  { key: 'happy_patients', value: 10000, label: 'Happy Patients', suffix: '+' },
  { key: 'expert_optometrists', value: 8, label: 'Expert Optometrists', suffix: '' },
  { key: 'designer_frames', value: 200, label: 'Designer Frames', suffix: '+' },
]

export function StatsCounter() {
  return (
    <section
      className="relative py-24 lg:py-32 text-white overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #010E3D 0%, #021848 35%, #010E3D 70%, #000B2E 100%)',
      }}
    >
      {/* Warm gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,172,228,0.04) 0%, transparent 40%, transparent 60%, rgba(6,172,228,0.03) 100%)',
        }}
      />

      {/* Warm gold accent orb — top-left */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(6,172,228,0.14) 0%, rgba(6,172,228,0.05) 35%, transparent 65%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Warm gold accent orb — bottom-right */}
      <div
        className="absolute bottom-0 right-0 w-[550px] h-[550px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 80% 80%, rgba(6,172,228,0.12) 0%, rgba(6,172,228,0.04) 40%, transparent 65%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Subtle warm gold accent orb — top-right (small) */}
      <div
        className="absolute top-[-60px] right-[15%] w-[300px] h-[300px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(6,172,228,0.07) 0%, transparent 60%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                delay: i * 0.15,
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="text-center flex flex-col items-center"
            >
              {/* Number + Suffix */}
              <div className="flex items-baseline justify-center">
                <SmoothCounter
                  value={stat.value}
                  suffix=""
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight"
                />
                {stat.suffix && (
                  <span
                    className="text-3xl sm:text-4xl lg:text-[2.8rem] font-bold ml-0.5"
                    style={{ color: '#06ACE4' }}
                  >
                    {stat.suffix}
                  </span>
                )}
              </div>

              {/* Thin gold separator line */}
              <div
                className="w-10 h-px mt-5 mb-4"
                style={{ backgroundColor: 'rgba(6,172,228,0.30)' }}
              />

              {/* Label */}
              <p
                className="text-xs sm:text-sm uppercase tracking-[0.18em] font-medium leading-relaxed"
                style={{ color: '#FBF8F3', opacity: 0.75 }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}