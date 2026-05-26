'use client'
import { motion } from 'framer-motion'
import { SmoothCounter } from '@/components/ui/SmoothCounter'

const stats = [
  { key: 'years_experience', value: 15, label: 'Years of Experience', suffix: '+' },
  { key: 'happy_patients', value: 10000, label: 'Happy Patients', suffix: '+' },
  { key: 'expert_staff', value: 8, label: 'Expert Staff', suffix: '' },
  { key: 'frame_collection', value: 200, label: 'Frame Collection', suffix: '+' },
]

export function StatsCounter() {
  return (
    <section className="relative py-20 text-white overflow-hidden" style={{
      background: 'linear-gradient(135deg, #010e3d 0%, #01174a 40%, #010e3d 100%)'
    }}>
      {/* Blurred gaussian light orb - bottom right corner */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{
        background: 'radial-gradient(circle at 80% 80%, rgba(6,172,228,0.18) 0%, rgba(6,172,228,0.06) 40%, transparent 70%)',
        filter: 'blur(60px)',
      }} />
      {/* Blurred gaussian light orb - center */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 50% 60%, rgba(6,172,228,0.10) 0%, rgba(1,14,61,0.05) 35%, transparent 65%)',
        filter: 'blur(50px)',
      }} />
      <div className="relative z-10 max-w-content mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <SmoothCounter
                value={stat.value}
                suffix={stat.suffix}
                className="text-4xl lg:text-5xl font-bold text-white"
              />
              <p className="text-sm text-white/60 mt-2 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}