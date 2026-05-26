import { HeroCarousel } from '@/components/home/HeroCarousel'
import { BenefitsStrip } from '@/components/home/BenefitsStrip'
import { EditorialSplit } from '@/components/home/EditorialSplit'
import { StatsCounter } from '@/components/home/StatsCounter'
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel'
import { CTABanner } from '@/components/home/CTABanner'

// Services section placeholder (inline for now)
import { ServicesSection } from '@/components/home/ServicesSection'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <BenefitsStrip />
      <EditorialSplit />
      <ServicesSection />
      <StatsCounter />
      <TestimonialsCarousel />
      <CTABanner />
    </>
  )
}