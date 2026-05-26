import Link from 'next/link'
import { Calendar, Users, Eye, Settings } from 'lucide-react'

const adminCards = [
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar, desc: 'Manage patient bookings', count: '12' },
  { href: '/admin/services', label: 'Services', icon: Eye, desc: 'Manage clinic services', count: '2' },
  { href: '/admin/products', label: 'Products', icon: Users, desc: 'Manage eyewear products', count: '20' },
  { href: '/admin/login', label: 'Settings', icon: Settings, desc: 'Site configuration', count: '-' },
]

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your clinic's content and bookings.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminCards.map((card) => (
          <Link key={card.href} href={card.href}
            className="bg-white rounded-2xl border border-gray-100 p-6 
                       hover:shadow-card-hover hover:-translate-y-1
                       transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary 
                            flex items-center justify-center mb-4">
              <card.icon size={20} />
            </div>
            <h3 className="font-semibold text-charcoal mb-1">{card.label}</h3>
            <p className="text-sm text-gray-400 mb-3">{card.desc}</p>
            <span className="text-2xl font-bold text-primary">{card.count}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}