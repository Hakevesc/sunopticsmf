'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Users, Eye, ShieldCheck, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Counts {
  bookings: number | null
  services: number | null
  products: number | null
  testimonials: number | null
  admins: number | null
}

export default function AdminDashboard() {
  const [counts, setCounts] = useState<Counts>({
    bookings: null, services: null, products: null, testimonials: null, admins: null,
  })

  useEffect(() => {
    async function fetchCounts() {
      const [b, s, p, t, a] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('services').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('glasses').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('testimonials').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.rpc('admin_users_list'),
      ])
      setCounts({
        bookings: b.count ?? 0,
        services: s.count ?? 0,
        products: p.count ?? 0,
        testimonials: t.count ?? 0,
        admins: Array.isArray(a.data) ? a.data.length : 0,
      })
    }
    fetchCounts()
  }, [])

  const fmt = (n: number | null) => (n === null ? '…' : String(n))

  const adminCards = [
    { href: '/admin/bookings',     label: 'Bookings',     icon: Calendar,        desc: 'Manage patient bookings',     count: fmt(counts.bookings) },
    { href: '/admin/services',     label: 'Services',     icon: Eye,             desc: 'Manage clinic services',      count: fmt(counts.services) },
    { href: '/admin/products',     label: 'Products',     icon: Users,           desc: 'Manage eyewear products',     count: fmt(counts.products) },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare,   desc: 'Manage customer reviews',     count: fmt(counts.testimonials) },
    { href: '/admin/account',      label: 'Account',      icon: ShieldCheck,     desc: 'Admin users & login',         count: fmt(counts.admins) },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your clinic&apos;s content and bookings.</p>
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
