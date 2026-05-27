'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminLogin, getAdminSession } from '@/lib/admin-auth'
import { AlertCircle, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (getAdminSession()) {
      router.replace('/admin')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await adminLogin(email.trim(), password)
      router.replace('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-charcoal">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage your clinic</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                       text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                       transition-all duration-300 outline-none"
              placeholder="admin@sunopticsmf.com"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-charcoal mb-1">Password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200
                       text-sm focus:border-primary focus:ring-1 focus:ring-primary/30
                       transition-all duration-300 outline-none"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white
                       rounded-xl py-3 text-sm font-medium hover:bg-primary-dark
                       transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn size={16} />
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
