'use client'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const contactInfo = [
  { icon: <MapPin size={20} />, label: 'Visit Us',
    value: 'Meskel Flower Branch, Next to Dreamliner Hotel, Sherifa Bldg, 2nd Floor' },
  { icon: <Phone size={20} />, label: 'Call Us',
    value: '0902 642 222 / 0902 642 223' },
  { icon: <Mail size={20} />, label: 'Email Us',
    value: 'sunopticsmeskelflower@gmail.com' },
  { icon: <Clock size={20} />, label: 'Working Hours',
    value: 'Mon-Sat: 8:00 AM - 6:00 PM' },
]

export default function ContactPage() {
  return (
    <section className="py-section">
      <div className="max-w-content mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="pretitle">Get In Touch</p>
          <h1 className="text-[clamp(2rem,4vw,3rem)] font-bold text-black">Contact Us</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-16">
          {/* Left: Contact cards */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-xl bg-snow 
                           border border-gray-100 hover:border-primary/20 
                           hover:shadow-subtle transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary 
                                flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-charcoal font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="flex gap-3 pt-4">
              {[
                { href: 'https://web.facebook.com/sunopticsmeskelflower', label: 'FB' },
                { href: 'https://www.instagram.com/sun_optics_meskel_flower', label: 'IG' },
                { href: 'https://www.tiktok.com/@sunopticsmeskelflower', label: 'TK' },
                { href: 'https://t.me/Sunopticsmeskelflowerbranch', label: 'TG' },
              ].map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener"
                  className="w-10 h-10 rounded-full border border-gray-200 
                             flex items-center justify-center text-gray-400
                             hover:bg-primary hover:border-primary hover:text-white
                             transition-all duration-300"
                  aria-label={social.label}>
                  <span className="text-xs font-semibold">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right: Google Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden shadow-lg 
                          border border-gray-100 min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6239786098487!2d38.7638!3d9.0121!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwMDAnNDMuNiJOIDM4wrA0NSc0OS4yIkU!5e0!3m2!1sen!2set!4v1"
              width="100%" height="100%" loading="lazy"
              className="min-h-[400px] lg:min-h-full"
              style={{ border: 0 }}
              title="SunOptics Clinic Location"
            />
          </div>
        </div>
      </div>
    </section>
  )
}