'use client'

import { motion } from 'framer-motion'
import { ServicesSection } from '@/components/home/ServicesSection'

const easeOutExpo = [0.16, 1, 0.3, 1] as const

export default function ServicesPage() {
  return (
    <>


<div className="pt-24">
  <ServicesSection isPage={true} />
</div>
    </>
  )
}