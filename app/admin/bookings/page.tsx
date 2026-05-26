'use client'
import { useState } from 'react'

const sampleBookings = [
  { id: '1', booking_date: '2026-05-26', booking_time: '09:00', first_name: 'Abebe', last_name: 'Kebede', email: 'abebe@email.com', phone: '0911 234 567', status: 'pending' },
  { id: '2', booking_date: '2026-05-26', booking_time: '10:30', first_name: 'Sara', last_name: 'Mohammed', email: 'sara@email.com', phone: '0922 345 678', status: 'confirmed' },
  { id: '3', booking_date: '2026-05-27', booking_time: '14:00', first_name: 'Dawit', last_name: 'Tesfaye', email: 'dawit@email.com', phone: '0933 456 789', status: 'pending' },
]

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = statusFilter === 'all'
    ? sampleBookings
    : sampleBookings.filter(b => b.status === statusFilter)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Bookings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage patient appointments</p>
        </div>
        <button className="bg-primary text-white rounded-xl px-5 py-2.5 text-sm font-medium
                           hover:bg-primary-dark transition-all duration-300">
          Export to Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
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

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Time</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Patient</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Phone</th>
              <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-charcoal">{booking.booking_date}</td>
                <td className="px-6 py-4 text-charcoal">{booking.booking_time}</td>
                <td className="px-6 py-4 font-medium text-charcoal">{booking.first_name} {booking.last_name}</td>
                <td className="px-6 py-4 text-gray-500">{booking.email}</td>
                <td className="px-6 py-4 text-gray-500">{booking.phone}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${booking.status === 'confirmed' ? 'bg-success-light text-success' : ''}
                    ${booking.status === 'pending' ? 'bg-warning-light text-warning' : ''}
                    ${booking.status === 'cancelled' ? 'bg-error-light text-error' : ''}`}>
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}