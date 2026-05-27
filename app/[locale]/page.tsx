import { HeroCarousel } from '@/components/home/HeroCarousel'
import { BenefitsStrip } from '@/components/home/BenefitsStrip'
import { EditorialSplit } from '@/components/home/EditorialSplit'
import { ServicesSection } from '@/components/home/ServicesSection'
import { EyewearShowcase } from '@/components/home/EyewearShowcase'
import { StatsCounter } from '@/components/home/StatsCounter'
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel'
import { CTABanner } from '@/components/home/CTABanner'

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <div className="md:hidden">
        <BenefitsStrip />
      </div>
      <EditorialSplit />
      <ServicesSection />
      <EyewearShowcase />
      <StatsCounter />
      <TestimonialsCarousel />
      <CTABanner />
    </>
  )
}