'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function AnimatedSection({
  children, className, delay = 0, direction = 'up'
}: AnimatedSectionProps) {
  const directionMap = {
    up:    { y: 30, x: 0 },
    down:  { y: -30, x: 0 },
    left:  { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionMap[direction] }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}