 'use client'

import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { BenefitsStrip } from './BenefitsStrip'

/* ─── Slide Data ─── */
const heroSlides = [
  {
    image: '/Assets/sunoptics cover (1).png',
    title: 'See the World\nin Clarity',
    description:
      "Where precision meets elegance — experience exceptional eye care at Addis Ababa's most refined optical clinic.",
    cta: { text: 'Book Your Visit', href: '/book' },
  },
  {
    image: '/Assets/sunoptics cover (2).png',
    title: 'Frames That\nDefine You',
    description:
      'Explore our curated collection of 200+ designer frames, handpicked for style and craftsmanship.',
    cta: { text: 'Explore Collection', href: '/products' },
  },
  {
    image: '/Assets/sunoptics cover (3).png',
    title: 'Precision Vision\nTechnology',
    description:
      'State-of-the-art computerized diagnostics for the most accurate prescriptions and personalized care.',
    cta: { text: 'Our Services', href: '/services' },
  },
  {
    image: '/Assets/sunoptics cover (4).png',
    title: 'Crafted with\nCare',
    description:
      'Over 15 years of excellence — our expert optometrists deliver personalized attention to every patient.',
    cta: { text: 'About Us', href: '/about' },
  },
  {
    image: '/Assets/sunoptics cover (5).png',
    title: 'Your Eyes\nDeserve the Best',
    description:
      'From comprehensive examinations to premium lenses — complete eye care under one elegant roof.',
    cta: { text: 'Learn More', href: '/about' },
  },
  {
    image: '/Assets/sunoptics cover (6).png',
    title: 'Elegance in\nEvery Detail',
    description:
      'Where clinical precision meets boutique luxury — welcome to SunOptics.',
    cta: { text: 'Book Appointment', href: '/book' },
  },
]

/* ─── Component ─── */
export function HeroCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)

  const autoplayPlugin = useMemo(
    () => Autoplay({ delay: 8000, stopOnInteraction: false }),
    []
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 60 },
    [autoplayPlugin]
  )

  const [activeIndex, setActiveIndex] = useState(0)

  /* Parallax scroll transforms */
  const { scrollY } = useScroll()
  const yBg = useTransform(scrollY, [0, 1000], [0, 200])
  const opacityBg = useTransform(scrollY, [0, 700], [1, 0.3])
  const yText = useTransform(scrollY, [0, 700], [0, 100])
  const opacityText = useTransform(scrollY, [0, 500], [1, 0])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setActiveIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', onSelect)
      return () => {
        emblaApi.off('select', onSelect)
      }
    }
  }, [emblaApi, onSelect])

  return (
    <section
      ref={containerRef}
      className="relative h-[100vh] min-h-[640px] w-full overflow-hidden"
      style={{ backgroundColor: '#010E3D' }}
    >
      {/* Subtle film-grain texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Embla viewport */}
      <div ref={emblaRef} className="h-full">
        <div className="flex h-full">
          {heroSlides.map((slide, i) => (
            <div
              key={i}
              className="relative h-full flex-[0_0_100%] overflow-hidden"
            >
              {/* Background image with parallax */}
              <motion.div
                style={{ y: yBg, opacity: opacityBg }}
                className="absolute inset-0 h-[120%] w-full"
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

              {/* Warm cinematic gradient overlays */}
              {/* Bottom warm fade — deep navy with warm brown undertone */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    'linear-gradient(to top, rgba(1,14,61,0.92) 0%, rgba(1,14,61,0.65) 25%, rgba(1,14,61,0.25) 55%, transparent 85%)',
                }}
              />

              {/* Diagonal warm overlay — adds fashion-editorial warmth */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(1,14,61,0.6) 0%, rgba(30,20,15,0.3) 40%, rgba(6,172,228,0.08) 70%, transparent 100%)',
                }}
              />

              {/* Warm golden vignette — soft light at center */}
              <div
                className="pointer-events-none absolute inset-0 z-10"
                style={{
                  background:
                    'radial-gradient(ellipse at 40% 50%, rgba(6,172,228,0.06) 0%, transparent 60%)',
                }}
              />

              {/* Text content */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 px-6 lg:px-12">
                <div className="mx-auto max-w-content">
                  <motion.div
                    style={{ y: yText, opacity: opacityText }}
                    initial={false}
                    animate={
                      activeIndex === i
                        ? {
                            opacity: 1,
                            y: 0,
                            transition: {
                              duration: 1,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          }
                        : { opacity: 0, y: 50 }
                    }
                    className="max-w-2xl text-left"
                  >
                    {/* Elegant eyebrow text */}
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={
                        activeIndex === i
                          ? {
                              opacity: 1,
                              x: 0,
                              transition: { delay: 0.2, duration: 0.8 },
                            }
                          : { opacity: 0, x: -20 }
                      }
                      className="mb-4 inline-block text-xs font-medium uppercase tracking-[0.25em]"
                      style={{ color: '#06ACE4' }}
                    >
                      SunOptics — Est. 2009
                    </motion.span>

                    {/* Serif heading */}
                    <h1
                      className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
                    >
                      {slide.title}
                    </h1>

                    {/* Description */}
                    <p className="mb-8 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">
                      {slide.description}
                    </p>

                    {/* CTA Button — warm gold pill */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Link
                        href={slide.cta.href}
                        className="group inline-flex w-fit items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold tracking-wide transition-all duration-400"
                        style={{
                          backgroundColor: '#06ACE4',
                          color: '#ffffff',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow =
                            '0 8px 30px rgba(6,172,228,0.45), 0 0 60px rgba(6,172,228,0.15)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.backgroundColor = '#0594C6'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none'
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.backgroundColor = '#06ACE4'
                        }}
                      >
                        {slide.cta.text}
                        <ArrowRight
                          size={16}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom-center dot navigation */}
      <div className="absolute bottom-20 md:bottom-32 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2.5">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className="group relative cursor-pointer p-1"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: activeIndex === idx ? '28px' : '8px',
                height: '8px',
                backgroundColor:
                  activeIndex === idx
                    ? '#06ACE4'
                    : 'rgba(255,255,255,0.35)',
                boxShadow:
                  activeIndex === idx
                    ? '0 0 12px rgba(6,172,228,0.5)'
                    : 'none',
              }}
            />
          </button>
        ))}
      </div>

      {/* Scroll-down indicator — animated chevron */}
      <motion.div
        className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center md:hidden"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span
          className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.2em]"
          style={{ color: 'rgba(6,172,228,0.6)' }}
        >
          Scroll
        </span>
        <ChevronDown
          size={18}
          style={{ color: 'rgba(6,172,228,0.5)' }}
        />
      </motion.div>

      {/* Embedded Benefits Strip for desktop */}
      <div className="absolute bottom-8 left-0 right-0 z-30 hidden md:block">
        <BenefitsStrip isHeroEmbed={true} />
      </div>

      {/* Top golden accent line */}
      <div
        className="absolute left-0 right-0 top-0 z-20 h-[1px]"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(6,172,228,0.3), transparent)',
        }}
      />
    </section>
  )
}