'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { LanguageSwitcher } from './LanguageSwitcher'

const navLinks = ['About', 'Services', 'Products', 'Contact']

function NavLink({ href, children, isLight }: { href: string; children: React.ReactNode; isLight: boolean }) {
  return (
    <Link href={href} className="group relative">
      <span className={`text-sm font-medium tracking-wide transition-colors duration-300
        ${isLight ? 'text-white/90 hover:text-white' : 'text-charcoal hover:text-[#06ACE4]'}`}>
        {children}
      </span>
      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#06ACE4]
                       rounded-full transition-all duration-300 ease-out-expo
                       group-hover:w-full group-hover:left-0" />
    </Link>
  )
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const pathSegments = pathname.split('/').filter(Boolean)
  const isHomepage = pathSegments.length === 0 || (pathSegments.length === 1 && (pathSegments[0] === 'en' || pathSegments[0] === 'am'))
  const showSolidHeader = isScrolled || !isHomepage

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ease-out-expo
      ${showSolidHeader
        ? 'bg-white/95 backdrop-blur-xl shadow-subtle border-b border-slate-100/50'
        : 'bg-transparent'
      }`}>
      <div className="max-w-content mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        
        {/* Logo — color logo with white overlay on transparent bg, full color on scroll */}
        <Link href="/" className="relative z-10">
          <Image
            src="/Logo/SunOptics_Color_Logo_MF.webp"
            alt="SunOptics"
            width={140}
            height={40}
            className={`h-8 w-auto transition-all duration-300 ${
              showSolidHeader ? '' : 'brightness-0 invert opacity-90'
            }`}
            priority
          />
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map(link => (
            <NavLink
              key={link}
              href={`/${link.toLowerCase()}`}
              isLight={!showSolidHeader}
            >
              {link}
            </NavLink>
          ))}
        </div>

        {/* Right Side — Language + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          <LanguageSwitcher isLight={!showSolidHeader} />
          <Link href="/book"
            className="bg-[#06ACE4] text-white rounded-full px-7 py-2.5 text-sm
                       font-bold tracking-wide
                       hover:bg-[#0594C6] hover:shadow-[0_8px_24px_rgba(6,172,228,0.35)]
                       active:bg-[#048ABC]
                       transform hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-300">
            Book Appointment
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden relative z-10"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle mobile menu"
        >
          <div className={`w-6 flex flex-col gap-1.5 transition-all duration-300
            ${showSolidHeader ? '[&>span]:bg-charcoal' : '[&>span]:bg-white'}`}>
            <span className={`block h-0.5 rounded-full transition-all duration-300
              ${isMobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block h-0.5 rounded-full transition-all duration-300
              ${isMobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 rounded-full transition-all duration-300
              ${isMobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu — full screen overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-charcoal z-40 flex flex-col items-center 
                       justify-center gap-8"
          >
            <div className="mb-4">
              <Image
                src="/Logo/SunOptics_Logo_Icon.webp"
                alt="SunOptics"
                width={48}
                height={48}
                className="h-12 w-auto brightness-0 invert"
              />
            </div>
            {[...navLinks, 'Book Appointment'].map((link, i) => (
              <motion.div
                key={link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
              >
                <Link
                  href={`/${link === 'Book Appointment' ? 'book' : link.toLowerCase().replace(' ', '-')}`}
                  className="text-3xl font-bold text-white hover:text-[#06ACE4]
                             transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link}
                </Link>
              </motion.div>
            ))}
            {/* Social icons at bottom */}
            <div className="absolute bottom-12 flex gap-6">
              <a href="https://web.facebook.com/sunopticsmeskelflower" target="_blank" rel="noopener" className="text-white/40 hover:text-[#06ACE4] transition-colors">FB</a>
              <a href="https://www.instagram.com/sun_optics_meskel_flower" target="_blank" rel="noopener" className="text-white/40 hover:text-[#06ACE4] transition-colors">IG</a>
              <a href="https://www.tiktok.com/@sunopticsmeskelflower" target="_blank" rel="noopener" className="text-white/40 hover:text-[#06ACE4] transition-colors">TK</a>
              <a href="https://t.me/Sunopticsmeskelflowerbranch" target="_blank" rel="noopener" className="text-white/40 hover:text-[#06ACE4] transition-colors">TG</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}