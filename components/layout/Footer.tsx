import Link from 'next/link'
import Image from 'next/image'

const socialLinks = [
  { href: 'https://web.facebook.com/sunopticsmeskelflower', label: 'Facebook' },
  { href: 'https://www.instagram.com/sun_optics_meskel_flower', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@sunopticsmeskelflower', label: 'TikTok' },
  { href: 'https://t.me/Sunopticsmeskelflowerbranch', label: 'Telegram' },
]

const quickLinks = ['About', 'Services', 'Products', 'Contact']

export function Footer() {
  return (
    <footer className="bg-[#010e3d] text-white">
      {/* Main footer content */}
      <div className="max-w-content mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">

          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            <Image
              src="/Logo/SunOptics_White_Logo_MF.webp"
              alt="SunOptics"
              width={160}
              height={45}
              className="h-10 w-auto mb-4"
            />
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              Speciality Eye Clinic & Optical Works. Expert eye care and premium
              eyewear in the heart of Addis Ababa.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-white/15 
                             flex items-center justify-center text-[#C9A96E]/70
                             hover:bg-[#C9A96E] hover:border-[#C9A96E] hover:text-white
                             transition-all duration-300"
                  aria-label={social.label}>
                  <SocialIcon label={social.label} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] 
                           text-white/30 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase()}`}
                    className="text-sm text-white/50 hover:text-[#C9A96E] 
                               transition-colors duration-200">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] 
                           text-white/30 mb-5">Services</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-white/50">Computerized Eye Testing</span></li>
              <li><span className="text-sm text-white/50">Optical Dispensary</span></li>
              <li><span className="text-sm text-white/50">Frame Fitting</span></li>
              <li><span className="text-sm text-white/50">Lens Solutions</span></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.2em] 
                           text-white/30 mb-5">Contact</h4>
            <div className="space-y-3 text-sm text-white/50">
              <a href="tel:+251902642222" className="block hover:text-[#C9A96E]/80 transition-colors duration-200">
                0902 642 222
              </a>
              <a href="tel:+251902642223" className="block hover:text-[#C9A96E]/80 transition-colors duration-200">
                0902 642 223
              </a>
              <a href="mailto:sunopticsmeskelflower@gmail.com" className="block hover:text-[#C9A96E]/80 transition-colors duration-200">
                sunopticsmeskelflower@gmail.com
              </a>
              <p>Meskel Flower Branch, Addis Ababa</p>
              <p className="text-white/30">Mon - Sat: 8:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-content mx-auto px-6 lg:px-8 py-6 
                        flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} SunOptics Eye Clinic. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-white/25 hover:text-[#C9A96E]/50 
                                            transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-white/25 hover:text-[#C9A96E]/50 
                                           transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ label }: { label: string }) {
  const icons: Record<string, string> = {
    Facebook: 'f',
    Instagram: 'ig',
    TikTok: 'tk',
    Telegram: 'tg',
  }

  return (
    <span className="text-xs font-semibold">{icons[label] || label[0]}</span>
  )
}