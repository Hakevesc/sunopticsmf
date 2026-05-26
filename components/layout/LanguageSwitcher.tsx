'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  isLight?: boolean
}

export function LanguageSwitcher({ isLight = false }: LanguageSwitcherProps) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = locale === 'en' ? 'am' : 'en'
  const label = locale === 'en' ? 'አማ' : 'EN'
  const fullLabel = locale === 'en' ? 'አማርኛ' : 'English'

  const handleSwitch = () => {
    const newPath = pathname.replace(`/${locale}`, `/${switchTo}`)
    router.push(newPath)
  }

  return (
    <button onClick={handleSwitch}
      title={`Switch to ${fullLabel}`}
      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 
                  rounded-full border transition-all duration-300
        ${isLight
          ? 'text-white/80 border-white/20 hover:bg-white/10 hover:text-white'
          : 'text-charcoal border-gray-200 hover:bg-gray-50 hover:border-primary/30'}`}>
      <Globe size={14} />
      {label}
    </button>
  )
}