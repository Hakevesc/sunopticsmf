'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-stats" />
        <div className="relative z-10 max-w-content mx-auto px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70 mb-6">
            About SunOptics
          </p>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] text-white font-extrabold mb-6">
            Our Story
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Dedicated to providing exceptional eye care and premium eyewear to our community.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-section">
        <div className="max-w-content mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <Image src="/images/clinic-interior.jpg" alt="SunOptics Clinic"
                  fill className="object-cover" sizes="50vw" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="pretitle">Our Mission</p>
              <h2 className="text-display-md mb-6">
                Evolving Vision,<br />Transforming Lives
              </h2>
              <p className="body-lg mb-6">
                At SunOptics Speciality Eye Clinic & Optical Works, we believe that 
                sight is our most precious sense. When someone's eyesight is given 
                its full potential, it can be life-changing.
              </p>
              <p className="body-md mb-6">
                Located in the heart of Addis Ababa at Meskel Flower, our clinic 
                combines advanced diagnostic technology with a curated collection of 
                premium eyewear &mdash; providing comprehensive eye care under one roof.
              </p>
              <p className="body-md mb-8">
                Our team of experienced optometrists and optical specialists is 
                committed to delivering personalized care and the highest quality 
                vision solutions for every patient.
              </p>
              <Link href="/book"
                className="inline-flex items-center gap-2 bg-primary text-white 
                           rounded-full px-8 py-3 text-sm font-medium
                           hover:bg-primary-dark transition-all duration-300">
                Book an Appointment <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}