'use client'
import { useState, useEffect, useCallback } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Download, RefreshCw, ArrowLeft, AlertCircle } from 'lucide-react'

interface Booking {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string | null
  booking_date: string
  booking_time: string
  reason: string | null
  special_requests: string | null
  status: string
  created_at: string
  service_id: string | null
  services?: { name_en: string } | null
  glasses_interest: string[] | null
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'cancelled', 'completed']

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          id, first_name, last_name, email, phone, address,
          booking_date, booking_time, reason, special_requests,
          status, created_at, service_id, glasses_interest,
          services ( name_en )
        `)
        .order('created_at', { ascending: false })
        .order('booking_date', { ascending: false })
        .order('booking_time', { ascending: false })

      if (fetchError) throw fetchError
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setBookings((data || []) as any)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id)
    try {
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', id)
      if (updateError) throw updateError
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = bookings.filter(b => {
    const statusMatch = statusFilter === 'all' || b.status === statusFilter
    const q = search.trim().toLowerCase()
    const searchMatch = !q ||
      `${b.first_name} ${b.last_name}`.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q)
    return statusMatch && searchMatch
  })

  const exportToExcel = () => {
    const rows = filtered.map(b => ({
      'Booking ID': b.id,
      'Patient Name': `${b.first_name} ${b.last_name}`,
      'Email': b.email,
      'Phone': b.phone,
      'Address': b.address || '',
      'Service': b.services?.name_en || '',
      'Date': b.booking_date,
      'Time': b.booking_time,
      'Status': b.status,
      'Reason': b.reason || '',
      'Special Requests': b.special_requests || '',
      'Created': b.created_at ? new Date(b.created_at).toLocaleString() : '',
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings')

    // Auto-size columns
    const colWidths = Object.keys(rows[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...rows.map(r => String(r[key as keyof typeof r] || '').length)
      ) + 2,
    }))
    worksheet['!cols'] = colWidths

    const dateStr = new Date().toISOString().split('T')[0]
    XLSX.writeFile(workbook, `bookings-${dateStr}.xlsx`)
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      confirmed: 'bg-green-50 text-green-700',
      pending: 'bg-amber-50 text-amber-700',
      cancelled: 'bg-red-50 text-red-700',
      completed: 'bg-blue-50 text-blue-700',
    }
    return styles[status] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${bookings.length} total · ${filtered.length} shown`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200
                       text-sm font-medium text-gray-600 hover:border-primary hover:text-primary
                       transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={exportToExcel}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5
                       text-sm font-medium hover:bg-primary-dark transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={14} />
            Export to Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex gap-2 flex-wrap">
          {['all', ...STATUS_OPTIONS].map((status) => (
            <button key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize
                         transition-all duration-300
                ${statusFilter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary'}`}>
              {status}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto px-4 py-2 rounded-xl border border-gray-200 text-sm
                     focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none
                     min-w-[240px]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Date / Time</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Patient</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Service</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading bookings...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No bookings found</td></tr>
              ) : (
                filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-charcoal font-medium">{booking.booking_date}</div>
                      <div className="text-xs text-gray-400">{booking.booking_time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-charcoal">{booking.first_name} {booking.last_name}</div>
                      {booking.address && <div className="text-xs text-gray-400 mt-0.5">{booking.address}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-600">{booking.email}</div>
                      <div className="text-xs text-gray-400">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{booking.services?.name_en || '—'}</td>
                    <td className="px-6 py-4">
                      <select
                        value={booking.status}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        disabled={updatingId === booking.id}
                        title="Change booking status"
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                   border-0 outline-none cursor-pointer
                                   ${statusBadge(booking.status)}
                                   ${updatingId === booking.id ? 'opacity-50' : ''}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
