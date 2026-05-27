'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export function EditorialSplit({ isPage = false }: { isPage?: boolean }) {
  return (
    <section className={`bg-[#eefbff] ${isPage ? 'pt-32 pb-16 md:pt-40 md:pb-[120px]' : 'py-16 md:py-[120px]'}`}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-24">
          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: easeOutExpo }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_20px_60px_-10px_rgba(120,90,50,0.18)]">
              <Image
                src="/Assets/about-sunoptics.jpg"
                alt="SunOptics — Where Vision Meets Elegance"
                fill
                className="object-cover transition-transform duration-700 will-change-transform hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Floating accent card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.4 }}
              className="group absolute -bottom-5 -right-4 rounded-2xl bg-black text-white border border-black px-7 py-5 transition-all duration-400 hover:scale-110 hover:bg-[#06ACE4] hover:text-white hover:border-[#06ACE4] hover:shadow-[0_8px_20px_rgba(6,172,228,0.3)] cursor-pointer lg:-bottom-6 lg:-right-6"
            >
              <span className="block text-3xl font-bold leading-none">
                15+
              </span>
              <span className="mt-1 block text-sm font-medium tracking-wide opacity-85">
                Years of Excellence
              </span>
            </motion.div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: 0.15 }}
            className="lg:py-6"
          >
            {/* Eyebrow */}
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#06ACE4]">
              {isPage ? 'Our Mission & Vision' : 'Our Story'}
            </p>

            {/* Heading */}
            <h2 className="mb-6 text-4xl font-light leading-[1.15] tracking-tight text-[#1a1a2e] md:text-5xl">
              {isPage ? (
                <>
                  Evolving Vision,<br />Transforming{' '}
                  <span className="font-semibold text-[#06ACE4]">
                    Lives
                  </span>
                </>
              ) : (
                <>
                  Where Vision Meets{' '}
                  <span className="font-medium text-[#06ACE4]">
                    Elegance
                  </span>
                </>
              )}
            </h2>

            {/* Body */}
            <p className="mb-4 text-lg leading-relaxed text-[#5a5a6e]">
              At SunOptics, we believe that sight is our most precious sense.
              When someone&apos;s eyesight is given its full potential, it can be
              life-changing.
            </p>
            <p className="mb-8 leading-relaxed text-[#7a7a8e]">
              Located in the heart of Addis Ababa at Meskel Flower, our clinic
              combines advanced diagnostic technology with a curated collection
              of premium eyewear — providing comprehensive eye care under one
              roof.
            </p>

            {/* CTA */}
            {isPage ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-8">
                <Link
                  href="/book"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-[#06ACE4] px-8 py-4 text-sm font-bold tracking-wide text-white transition-all duration-300 hover:bg-[#0594C6] hover:-translate-y-0.5 shadow-md hover:shadow-[0_8px_24px_rgba(6,172,228,0.35)] whitespace-nowrap"
                >
                  Book Your Visit
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#06ACE4] transition-all duration-300 hover:gap-3"
                >
                  <span className="relative">
                    Explore Services
                    <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#06ACE4] transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            ) : (
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-[#06ACE4] transition-all duration-300 hover:gap-3"
              >
                <span className="relative">
                  Discover Our Story
                  <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-[#06ACE4] transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}