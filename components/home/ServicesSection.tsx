'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ScanEye, Glasses, Check, type LucideIcon } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  icon: LucideIcon
  image: string
  features?: string[]
}

const services: Service[] = [
  {
    id: 'computerized-eye-testing',
    name: 'Computerized Eye Testing',
    description:
      'Advanced digital refraction technology for precise prescriptions. Our state-of-the-art equipment ensures accurate diagnosis and personalized vision solutions.',
    icon: ScanEye,
    image: '/Assets/eye-test.jpg',
    features: [
      'Digital auto-refraction',
      'Subjective verification',
      'Color vision testing',
      'Visual field screening',
    ],
  },
  {
    id: 'optical-dispensary',
    name: 'Optical Dispensary',
    description:
      'Browse our curated collection of premium frames and precision-crafted lenses. Expert fitting and personalized style consultation included.',
    icon: Glasses,
    image: '/Assets/glass-choice.jpg',
    features: [
      '200+ premium frames',
      'Precision lens crafting',
      'Expert fitting service',
      'Style consultation',
    ],
  },
]

const easeOutExpo = [0.16, 1, 0.3, 1] as const

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOutExpo,
    },
  },
}

export function ServicesSection({ isPage = false }: { isPage?: boolean }) {
  return (
    <section id="services-list" className={`${isPage ? 'bg-[#eefbff]' : 'bg-white'} py-16 md:py-[120px]`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="mb-14 text-center md:mb-16"
        >
          {/* Eyebrow */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#06ACE4]">
            What We Offer
          </p>

          {/* Heading */}
          <h2 className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-4xl font-light tracking-tight text-[#1a1a2e] md:text-5xl">
            <span>Exceptional Eye Care</span>
            <span className="inline-block rounded-full bg-gradient-to-r from-[#06ACE4] to-[#38BDE8] px-5 py-1.5 text-[1em] font-normal tracking-wide text-white leading-tight">
              Services
            </span>
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-8 md:grid-cols-2"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.id}
                variants={cardVariants}
                className="group overflow-hidden rounded-2xl border border-[#06ACE4]/12 bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(6,172,228,0.14)]"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                </div>

                {/* Content */}
                <div className="p-7 md:p-8">
                  {/* Icon */}
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#06ACE4]/10 text-[#06ACE4] transition-colors duration-300 group-hover:bg-[#06ACE4]/15">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-[#1a1a2e]">
                    {service.name}
                  </h3>

                  <p className="mb-6 leading-relaxed text-[#7a7a8e]">
                    {service.description}
                  </p>

                  {isPage && service.features && (
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-[#010E3D]/80 text-sm font-light">
                          <Check size={16} className="text-[#06ACE4] flex-shrink-0" strokeWidth={2.5} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {isPage ? (
                    <Link
                      href="/book"
                      className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#06ACE4] px-8 py-3.5 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#0594C6] hover:-translate-y-0.5 whitespace-nowrap shadow-md hover:shadow-[0_8px_24px_rgba(6,172,228,0.35)]"
                    >
                      Book Service
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  ) : (
                    <Link
                      href={`/services#${service.id}`}
                      className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[#06ACE4] transition-all duration-300 hover:gap-3"
                    >
                      <span className="relative">
                        Learn More
                        <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#06ACE4] transition-all duration-300 group-hover/link:w-full" />
                      </span>
                      <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}