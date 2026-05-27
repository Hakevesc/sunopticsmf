'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ShowcaseFrame {
  id: string
  name: string
  image: string
}

const FALLBACK_FRAMES: ShowcaseFrame[] = [
  { id: 'f1', name: 'Cat-Eye Butterfly', image: '/Glasses/Cat-Eye  Butterfly.webp' },
  { id: 'f2', name: 'Round Classic', image: '/Glasses/Round.webp' },
  { id: 'f3', name: 'Soft Corner Rectangle', image: '/Glasses/Soft Corner Rectangle.webp' },
  { id: 'f4', name: 'Oval Rounded', image: '/Glasses/Oval-Rounded.webp' },
  { id: 'f5', name: 'Rounded Rectangle', image: '/Glasses/Rounded Rectangle.webp' },
  { id: 'f6', name: 'Sunglasses', image: '/Glasses/Sunglasses.webp' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
}

export function EyewearShowcase() {
  const [frames, setFrames] = useState<ShowcaseFrame[]>(FALLBACK_FRAMES)

  useEffect(() => {
    async function loadFrames() {
      // Prefer featured products; fall back to most recently added
      const { data: featured } = await supabase
        .from('glasses')
        .select('id, name_en, image_url')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6)

      let rows = featured || []
      if (rows.length < 6) {
        const { data: latest } = await supabase
          .from('glasses')
          .select('id, name_en, image_url')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(6)
        rows = latest || []
      }

      if (rows.length > 0) {
        setFrames(
          rows
            .filter(r => !!r.image_url)
            .map(r => ({
              id: r.id,
              name: r.name_en,
              image: r.image_url as string,
            }))
        )
      }
    }
    loadFrames()
  }, [])

  return (
    <section className="relative bg-white py-20 lg:py-28 overflow-hidden">
      <style>{SHOWCASE_STYLES}</style>

      <div className="max-w-[1340px] mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14 lg:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-medium uppercase tracking-[0.2em] text-[#06ACE4] mb-4"
          >
            Featured Collection
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="text-3xl lg:text-[2.75rem] font-light text-[#010E3D] tracking-tight leading-tight"
          >
            Handpicked for{' '}
            <span className="showcase-style-badge">Style</span>
          </motion.h2>
        </div>

        {/* Frames grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-7"
        >
          {frames.map((frame) => (
            <motion.div
              key={frame.id}
              variants={cardVariants}
              className="showcase-card group"
            >
              <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl bg-[#eefbff]">
                <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-10">
                  <Image
                    src={frame.image}
                    alt={frame.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain transition-transform duration-500 ease-out group-hover:scale-108 mix-blend-multiply"
                  />
                </div>
              </div>
              <div className="px-4 py-4 lg:py-5 text-center">
                <p className="text-xs lg:text-sm font-medium uppercase tracking-[0.15em] text-[#010E3D]/70">
                  {frame.name}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View collection link */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12 lg:mt-16"
        >
          <Link
            href="/products"
            className="showcase-link group/link"
          >
            View Full Collection
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover/link:translate-x-1"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

const SHOWCASE_STYLES = `
.showcase-style-badge {
  display: inline-block;
  background: linear-gradient(135deg, #06ACE4 0%, #38BDE8 100%);
  color: #ffffff;
  padding: 0.18em 0.8em;
  border-radius: 9999px;
  font-weight: 400;
  font-style: normal;
  font-size: 1em;
}

.showcase-card {
  background: #ffffff;
  border: 1px solid rgba(6, 172, 228, 0.12);
  border-radius: 1.5rem;
  overflow: hidden;
  transition: box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.showcase-card:hover {
  box-shadow: 0 12px 40px rgba(6, 172, 228, 0.14);
  transform: translateY(-2px);
}

.showcase-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #06ACE4;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-decoration: none;
  transition: color 0.3s ease;
}

.showcase-link:hover {
  color: #0594C6;
}
`
