'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 right-8 z-[150]"
        >
          <Link href="/book"
            className="flex items-center gap-2.5 bg-[#C9A96E] text-white 
                       rounded-full px-6 py-3.5 text-sm font-medium
                       shadow-[0_8px_24px_rgba(201,169,110,0.35)] hover:bg-[#B8965A]
                       hover:shadow-2xl transform hover:-translate-y-0.5
                       transition-all duration-300">
            <Calendar size={18} />
            Book Appointment
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}