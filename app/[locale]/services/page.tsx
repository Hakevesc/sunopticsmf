'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, ScanEye, Glasses } from 'lucide-react'
import { fadeUp } from '@/lib/animations'

const services = [
  {
    id: 'computerized-eye-testing',
    name_en: 'Computerized Eye Testing',
    description_en: 'Advanced digital refraction technology for precise prescriptions. Our state-of-the-art equipment ensures accurate diagnosis and personalized vision solutions.',
    icon_name: 'scan-eye',
    image_url: '/Assets/eye-test.jpg',
    features: ['Digital auto-refraction', 'Subjective verification', 'Color vision testing', 'Visual field screening'],
  },
  {
    id: 'optical-dispensary',
    name_en: 'Optical Dispensary',
    description_en: 'Browse our curated collection of premium frames and precision-crafted lenses. Expert fitting and personalized style consultation included.',
    icon_name: 'glasses',
    image_url: '/Assets/glass-choice.jpg',
    features: ['200+ premium frames', 'Precision lens crafting', 'Expert fitting service', 'Style consultation'],
  },
]

function DynamicIcon({ name, size = 24 }: { name: string; size?: number }) {
  switch (name) {
    case 'scan-eye':
      return <ScanEye size={size} />
    case 'glasses':
      return <Glasses size={size} />
    default:
      return <ScanEye size={size} />
  }
}

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-stats" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-white/5 
                        rounded-full blur-3xl" />
        <div className="relative z-10 max-w-content mx-auto px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
              What We Offer
            </p>
            <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-white font-extrabold mb-6">
              Services at<br />SunOptics Eye Clinic
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Explore how our expert eye care services are designed to protect
              your vision and enhance your everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Detail Sections - alternating layout */}
      {services.map((service, i) => (
        <section key={service.id} className="py-section">
          <div className={`max-w-content mx-auto px-6 lg:px-8 grid lg:grid-cols-2 
                           gap-16 lg:gap-24 items-center`}>
            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`relative rounded-2xl overflow-hidden aspect-[4/3] ${i % 2 === 1 ? 'lg:order-2' : ''}`}
            >
              <Image src={service.image_url} alt={service.name_en}
                fill className="object-cover" sizes="50vw" />
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className={i % 2 === 1 ? 'lg:order-1' : ''}
            >
<div className="w-14 h-14 rounded-2xl bg-primary-light text-primary 
                                flex items-center justify-center mb-6">
                <DynamicIcon name={service.icon_name} size={24} />
              </div>
              <h2 className="text-display-md mb-6">{service.name_en}</h2>
              <p className="body-lg mb-8">{service.description_en}</p>

              {/* Feature bullets */}
              <ul className="space-y-3 mb-8">
                {service.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-slate">
                    <Check size={18} className="text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link href="/book"
                className="inline-flex items-center gap-2 bg-primary text-white 
                           rounded-full px-8 py-3 text-sm font-medium
                           hover:bg-primary-dark hover:shadow-primary-lg
                           transition-all duration-300">
                Book This Service <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>
      ))}
    </>
  )
}