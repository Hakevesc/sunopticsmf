'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function EditorialSplit() {
  return (
    <section className="py-section">
      <div className="max-w-content mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
              <Image src="/Assets/about-sunoptics.jpg" alt="SunOptics Clinic"
                fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="50vw" />
            </div>
            {/* Decorative accent — floating stat card */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-white 
                            rounded-xl p-6 shadow-primary-lg border border-accent">
              <span className="text-3xl font-bold block">15+</span>
              <span className="text-sm text-white/80">Years of Excellence</span>
            </div>
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <p className="pretitle">About SunOptics</p>
            <div className="section-heading justify-start mb-6">
              <span className="section-heading-dark">Evolving Vision,</span>
              <span className="section-heading-box">Transforming Lives</span>
            </div>
            <p className="body-lg mb-6">
              At SunOptics, we believe that sight is our most precious sense. When
              someone's eyesight is given its full potential, it can be life-changing.
            </p>
            <p className="body-md mb-8">
              Located in the heart of Addis Ababa at Meskel Flower, our clinic
              combines advanced diagnostic technology with a curated collection of
              premium eyewear — providing comprehensive eye care under one roof.
            </p>
            <Link href="/about"
              className="inline-flex items-center gap-2 text-primary font-medium 
                         hover:gap-3 transition-all duration-300">
              Discover Our Story <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}