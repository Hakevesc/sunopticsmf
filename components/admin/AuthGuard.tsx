'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getAdminSession, clearAdminSession, type AdminSession } from '@/lib/admin-auth'
import { LogOut } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<AdminSession | null>(null)
  const [checked, setChecked] = useState(false)

  const isLoginRoute = pathname?.startsWith('/admin/login')

  useEffect(() => {
    const current = getAdminSession()
    setSession(current)
    setChecked(true)
    if (!current && !isLoginRoute) {
      router.replace('/admin/login')
    }
  }, [isLoginRoute, router])

  const handleLogout = () => {
    clearAdminSession()
    setSession(null)
    router.replace('/admin/login')
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
        Loading…
      </div>
    )
  }

  if (isLoginRoute) {
    return <>{children}</>
  }

  if (!session) {
    return null
  }

  return (
    <>
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="text-sm font-semibold text-charcoal">SunOptics Admin</div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-500 hidden sm:inline">
              {session.full_name || session.email}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200
                         text-gray-600 hover:border-primary hover:text-primary transition-all"
            >
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </header>
      {children}
    </>
  )
}
