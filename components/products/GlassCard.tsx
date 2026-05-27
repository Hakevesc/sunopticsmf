'use client'
import Image from 'next/image'
import { Glasses } from 'lucide-react'

interface Glass {
  id: string
  name_en: string
  name_am?: string
  glass_code?: string
  image_url?: string
  is_new?: boolean
  is_featured?: boolean
  glass_categories?: { name_en: string; name_am?: string }
  lens_category_slugs?: string[]
  lens_need_slugs?: string[]
}

export function GlassCard({ glass }: { glass: Glass }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 
                    overflow-hidden hover:shadow-card-hover hover:-translate-y-1
                    transition-all duration-500 ease-out-expo cursor-pointer">
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-[#eefbff] overflow-hidden p-8
                      flex items-center justify-center">
        {glass.image_url ? (
          <Image src={glass.image_url} alt={glass.name_en}
            fill className="object-contain p-6 transition-transform 
                            duration-700 group-hover:scale-110 mix-blend-multiply"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
        ) : (
          <Glasses size={64} className="text-gray-200" />
        )}

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {glass.is_new && (
            <span className="px-2.5 py-1 rounded-full bg-primary text-white 
                            text-[10px] font-bold uppercase tracking-wider">
              New
            </span>
          )}
          {glass.is_featured && (
            <span className="px-2.5 py-1 rounded-full bg-charcoal text-white 
                            text-[10px] font-bold uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5
                        flex items-center justify-center transition-all duration-300">
          <button className="opacity-0 group-hover:opacity-100 
                             bg-white rounded-full px-5 py-2 text-xs font-medium 
                             text-charcoal shadow-lg transform translate-y-2 
                             group-hover:translate-y-0
                             transition-all duration-300 delay-100"
            aria-label="Quick view">
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        {glass.glass_categories && (
          <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
            {glass.glass_categories.name_en}
          </p>
        )}
        <h3 className="font-semibold text-charcoal text-sm mb-1 
                       group-hover:text-primary transition-colors">
          {glass.name_en}
        </h3>
        {glass.glass_code && (
          <p className="text-xs text-gray-400 font-mono">{glass.glass_code}</p>
        )}
      </div>
    </div>
  )
}