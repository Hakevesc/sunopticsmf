'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ScanEye, Glasses } from 'lucide-react'

const services = [
  {
    id: 'computerized-eye-testing',
    name_en: 'Computerized Eye Testing',
    description_en: 'Advanced digital refraction technology for precise prescriptions. Our state-of-the-art equipment ensures accurate diagnosis and personalized vision solutions.',
    icon_name: 'scan-eye',
    image_url: '/Assets/eye-test.jpg',
  },
  {
    id: 'optical-dispensary',
    name_en: 'Optical Dispensary',
    description_en: 'Browse our curated collection of premium frames and precision-crafted lenses. Expert fitting and personalized style consultation included.',
    icon_name: 'glasses',
    image_url: '/Assets/glass-choice.jpg',
  },
]

function DynamicIcon({ name, size = 22 }: { name: string; size?: number }) {
  switch (name) {
    case 'scan-eye':
      return <ScanEye size={size} />
    case 'glasses':
      return <Glasses size={size} />
    default:
      return <ScanEye size={size} />
  }
}

export function ServicesSection() {
  return (
    <section className="py-section bg-snow">
      <div className="max-w-content mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 flex flex-col items-center">
          <p className="pretitle">What We Offer</p>
          <div className="section-heading justify-center">
            <span className="section-heading-dark">Exceptional Eye Care</span>
            <span className="section-heading-box">Services</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100
                         hover:shadow-xl hover:-translate-y-1
                         transition-all duration-500 ease-out-expo"
            >
              {/* Image area */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                <Image src={service.image_url} alt={service.name_en}
                  fill className="object-cover transition-transform duration-700
                                  group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t
                                from-charcoal/40 to-transparent" />
              </div>
              {/* Content */}
              <div className="p-8">
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary
                                flex items-center justify-center mb-4
                                group-hover:bg-primary group-hover:text-white
                                transition-colors duration-300">
                  <DynamicIcon name={service.icon_name} size={22} />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-3">
                  {service.name_en}
                </h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  {service.description_en}
                </p>
                <Link href={`/services#${service.id}`}
                  className="inline-flex items-center gap-2 text-primary text-sm 
                             font-medium group-hover:gap-3 transition-all duration-300">
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}