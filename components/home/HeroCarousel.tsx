'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const heroSlides = [
  {
    image: '/Assets/sunoptics cover (1).png',
    title: 'Specialized Eye Care Services',
    description: 'Comprehensive eye examinations with state-of-the-art diagnostic technology for accurate prescriptions and vision solutions.',
    cta: { text: 'Book Appointment', href: '/book' },
  },
  {
    image: '/Assets/sunoptics cover (2).png',
    title: 'Premium Eyewear Collection',
    description: 'Discover our curated collection of designer frames and precision-crafted lenses tailored to your style.',
    cta: { text: 'Explore Collection', href: '/products' },
  },
  {
    image: '/Assets/sunoptics cover (3).png',
    title: 'Advanced Vision Technology',
    description: 'Computerized eye testing with advanced refraction equipment for the most precise vision diagnosis.',
    cta: { text: 'Our Services', href: '/services' },
  },
  {
    image: '/Assets/sunoptics cover (4).png',
    title: 'Expert Optometry Team',
    description: 'Our experienced optometrists provide personalized care and the highest quality vision solutions.',
    cta: { text: 'Meet Our Team', href: '/about' },
  },
  {
    image: '/Assets/sunoptics cover (5).png',
    title: 'Quality You Can Trust',
    description: 'Over 15 years of excellence in eye care, serving thousands of satisfied patients in Addis Ababa.',
    cta: { text: 'Learn More', href: '/about' },
  },
  {
    image: '/Assets/sunoptics cover (6).png',
    title: 'Your Vision, Our Mission',
    description: 'Comprehensive eye care under one roof — from diagnosis to the perfect pair of glasses.',
    cta: { text: 'Book Now', href: '/book' },
  },
]

export function HeroCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayRef = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  )
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 45 },
    [autoplayRef.current]
  )
  const [activeIndex, setActiveIndex] = useState(0)

  // Advanced scroll-linked transformations for immersive parallax
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 1000], [0, 180])
  const opacityBg = useTransform(scrollY, [0, 800], [1, 0.4])
  const yText = useTransform(scrollY, [0, 800], [0, 120])
  const opacityText = useTransform(scrollY, [0, 600], [1, 0])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <section ref={containerRef} className="relative h-[80vh] min-h-[580px] md:h-[85vh] md:min-h-[620px] w-full overflow-hidden bg-[#071D30]">
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {heroSlides.map((slide, i) => (
            <div key={i} className="flex-[0_0_100%] relative h-full overflow-hidden">
              {/* Background image container with smooth scroll parallax scale */}
              <motion.div 
                style={{ y: yBg, opacity: opacityBg, scale: 1.05 }}
                className="absolute inset-0 h-full w-full"
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                />
              </motion.div>

              {/* Sophisticated diagonal midnight-blue fade gradient overlay - decreased opacity */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#071D30]/80 via-[#071D30]/35 to-transparent z-10" />

              {/* Bottom faded gradient overlay - #010e3d, fading smoothly to top with decreased opacity */}
              <div className="absolute inset-0 z-10" style={{
                background: 'linear-gradient(to top, rgba(1,14,61,0.85) 0%, rgba(1,14,61,0.55) 30%, rgba(1,14,61,0.15) 65%, transparent 100%)'
              }} />

              {/* Blurred gaussian light orb - bottom right corner */}
              <div className="absolute bottom-0 right-0 z-10 w-[500px] h-[500px] pointer-events-none" style={{
                background: 'radial-gradient(circle at 80% 80%, rgba(6,172,228,0.18) 0%, rgba(6,172,228,0.06) 40%, transparent 70%)',
                filter: 'blur(60px)',
              }} />

              {/* Blurred gaussian light orb - center */}
              <div className="absolute inset-0 z-10 pointer-events-none" style={{
                background: 'radial-gradient(ellipse at 50% 60%, rgba(6,172,228,0.10) 0%, rgba(1,14,61,0.05) 35%, transparent 65%)',
                filter: 'blur(50px)',
              }} />

              {/* Text content floating elegantly on the gradient fade (no background cards) */}
              <div className="absolute bottom-40 md:bottom-48 lg:bottom-52 left-0 right-0 z-20 px-6 lg:px-12">
                <div className="max-w-content mx-auto">
                  <motion.div
                    style={{ y: yText, opacity: opacityText }}
                    initial={false}
                    animate={activeIndex === i
                      ? { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }
                      : { opacity: 0, y: 40 }
                    }
                    className="max-w-2xl text-left"
                  >
                    <h1 className="text-white font-extrabold mb-5 
                                   text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.06] tracking-tight">
                      {slide.title}
                    </h1>
                    <p className="text-white/85 text-base lg:text-lg mb-8 max-w-xl leading-relaxed font-light">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                      <Link href={slide.cta.href}
                        className="inline-flex items-center gap-2 bg-[#06ACE4] text-white 
                                   rounded-full px-8 py-4 text-sm font-medium tracking-wide
                                   hover:bg-[#0592c2] hover:shadow-[0_8px_24px_rgba(6,172,228,0.35)]
                                   transform hover:-translate-y-0.5
                                   transition-all duration-300 w-fit">
                        {slide.cta.text}
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical progress indicators — right side, vertically centered */}
      <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
        {heroSlides.map((_, idx) => (
          <button key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`w-[3px] rounded-full transition-all duration-500 cursor-pointer
              ${activeIndex === idx
                ? 'h-10 bg-[#06ACE4] shadow-[0_0_8px_rgba(6,172,228,0.5)]'
                : 'h-5 bg-white/30 hover:bg-white/60'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  )
}