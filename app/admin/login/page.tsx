'use client'
import { useState } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement Supabase auth login
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-charcoal">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your clinic</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                       text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                       transition-all duration-300 outline-none"
              placeholder="admin@SunOptics.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 
                       text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                       transition-all duration-300 outline-none"
              placeholder="Enter password" />
          </div>
          <button type="submit"
            className="w-full bg-primary text-white rounded-xl py-3 text-sm font-medium
                       hover:bg-primary-dark transition-all duration-300">
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}