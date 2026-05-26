import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { FloatingCTA } from '@/components/layout/FloatingCTA'
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: 'SunOptics Eye Clinic | Premium Eye Care in Addis Ababa',
    template: '%s | SunOptics Eye Clinic',
  },
  description: 'Expert eye care and premium eyewear at Meskel Flower, Addis Ababa. Computerized eye testing, optical dispensary, and 200+ designer frames.',
  keywords: ['eye clinic addis ababa', 'optical shop ethiopia', 'eye test meskel flower', 'glasses addis ababa', 'SunOptics'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sunoptics.et',
    siteName: 'SunOptics Eye Clinic',
  },
  alternates: {
    languages: {
      'en': '/en',
      'am': '/am',
    },
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Ethiopic:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "SunOptics Speciality Eye Clinic",
              "image": "https://sunoptics.et/images/og-image.jpg",
              "telephone": "+251902642222",
              "email": "sunopticsmeskelflower@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Meskel Flower Branch, Sherifa Bldg, 2nd Floor",
                "addressLocality": "Addis Ababa",
                "addressCountry": "ET",
              },
              "openingHours": "Mo-Sa 08:00-18:00",
              "priceRange": "$$",
              "medicalSpecialty": "Optometry",
            }),
          }}
        />
      </head>
      <NextIntlClientProvider messages={messages}>
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingCTA />
      </NextIntlClientProvider>
    </>
  )
}