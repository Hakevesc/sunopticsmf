'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ScanEye, Glasses, type LucideIcon } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  icon: LucideIcon
  image: string
}

const services: Service[] = [
  {
    id: 'computerized-eye-testing',
    name: 'Computerized Eye Testing',
    description:
      'Advanced digital refraction technology for precise prescriptions. Our state-of-the-art equipment ensures accurate diagnosis and personalized vision solutions.',
    icon: ScanEye,
    image: '/Assets/eye-test.jpg',
  },
  {
    id: 'optical-dispensary',
    name: 'Optical Dispensary',
    description:
      'Browse our curated collection of premium frames and precision-crafted lenses. Expert fitting and personalized style consultation included.',
    icon: Glasses,
    image: '/Assets/glass-choice.jpg',
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

export function ServicesSection() {
  return (
    <section className="bg-white py-16 md:py-[120px]">
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
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A96E]">
            What We Offer
          </p>

          {/* Heading */}
          <h2 className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-4xl font-light tracking-tight text-[#1a1a2e] md:text-5xl">
            <span>Exceptional Eye Care</span>
            <span className="inline-block rounded-full bg-[#C9A96E] px-5 py-1.5 text-[0.6em] font-semibold tracking-wide text-white">
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
                className="group overflow-hidden rounded-2xl border border-[#f0ebe3] bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(120,90,50,0.15)]"
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
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#C9A96E]/10 text-[#C9A96E] transition-colors duration-300 group-hover:bg-[#C9A96E]/15">
                    <Icon size={22} strokeWidth={1.8} />
                  </div>

                  <h3 className="mb-3 text-xl font-semibold tracking-tight text-[#1a1a2e]">
                    {service.name}
                  </h3>

                  <p className="mb-6 leading-relaxed text-[#7a7a8e]">
                    {service.description}
                  </p>

                  <Link
                    href={`/services#${service.id}`}
                    className="group/link inline-flex items-center gap-2 text-sm font-semibold text-[#C9A96E] transition-all duration-300 hover:gap-3"
                  >
                    <span className="relative">
                      Learn More
                      <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#C9A96E] transition-all duration-300 group-hover/link:w-full" />
                    </span>
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover/link:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}