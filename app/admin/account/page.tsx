'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getAdminSession } from '@/lib/admin-auth'
import { ArrowLeft, Plus, Trash2, KeyRound, AlertCircle, X, Mail, ShieldCheck } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  full_name: string | null
  created_at: string
}

export default function AdminAccountPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showReset, setShowReset] = useState<AdminUser | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [addForm, setAddForm] = useState({ email: '', password: '', full_name: '' })
  const [resetPassword, setResetPassword] = useState('')

  const me = getAdminSession()

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: e } = await supabase.rpc('admin_users_list')
      if (e) throw e
      setUsers((data || []) as AdminUser[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admins')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleAdd = async () => {
    const email = addForm.email.trim().toLowerCase()
    const password = addForm.password
    if (!email || !password) {
      setError('Email and password are required')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { error: e } = await supabase.rpc('admin_users_create', {
        p_email: email,
        p_password: password,
        p_full_name: addForm.full_name.trim(),
      })
      if (e) throw e
      setShowAdd(false)
      setAddForm({ email: '', password: '', full_name: '' })
      setInfo(`Admin ${email} created`)
      fetchUsers()
      setTimeout(() => setInfo(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin')
    } finally {
      setSaving(false)
    }
  }

  const handleResetPassword = async () => {
    if (!showReset || resetPassword.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setSaving(true)
    setError('')
    try {
      const { error: e } = await supabase.rpc('admin_users_update_password', {
        p_id: showReset.id,
        p_new_password: resetPassword,
      })
      if (e) throw e
      setShowReset(null)
      setResetPassword('')
      setInfo(`Password updated for ${showReset.email}`)
      setTimeout(() => setInfo(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u: AdminUser) => {
    if (u.id === me?.id) {
      setError("You can't delete the currently signed-in account.")
      return
    }
    if (!confirm(`Delete admin ${u.email}? This cannot be undone.`)) return
    setBusyId(u.id)
    setError('')
    try {
      const { error: e } = await supabase.rpc('admin_users_delete', { p_id: u.id })
      if (e) throw e
      setUsers(prev => prev.filter(x => x.id !== u.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-2">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-charcoal">Admin Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading…' : `${users.length} admin user${users.length === 1 ? '' : 's'}`}
            {me?.email && <> · signed in as <span className="font-medium text-charcoal">{me.email}</span></>}
          </p>
        </div>
        <button
          onClick={() => { setAddForm({ email: '', password: '', full_name: '' }); setError(''); setShowAdd(true) }}
          className="inline-flex items-center gap-2 bg-primary text-white rounded-xl px-5 py-2.5
                     text-sm font-medium hover:bg-primary-dark transition-all"
        >
          <Plus size={16} /> Add Admin
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {info && (
        <div className="mb-6 flex items-start gap-2 p-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700">
          <ShieldCheck size={16} className="mt-0.5 flex-shrink-0" />
          <span>{info}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Full Name</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Created</th>
                <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400">No admin users</td></tr>
              ) : users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 font-medium text-charcoal">
                      <Mail size={14} className="text-gray-400" />
                      {u.email}
                      {u.id === me?.id && (
                        <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary text-[10px] font-bold uppercase tracking-wider">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{u.full_name || '—'}</td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-3">
                      <button
                        onClick={() => { setResetPassword(''); setError(''); setShowReset(u) }}
                        disabled={busyId === u.id}
                        className="inline-flex items-center gap-1 text-charcoal hover:text-primary text-sm"
                      >
                        <KeyRound size={14} /> Reset password
                      </button>
                      <button
                        onClick={() => handleDelete(u)}
                        disabled={busyId === u.id || u.id === me?.id}
                        className="inline-flex items-center gap-1 text-red-500 hover:text-red-700
                                   disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div onClick={() => setShowAdd(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-charcoal">Add Admin User</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email *</label>
                <input
                  type="email"
                  autoComplete="off"
                  value={addForm.email}
                  onChange={e => setAddForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                             focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  placeholder="newadmin@sunopticsmf.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
                <input
                  type="text"
                  value={addForm.full_name}
                  onChange={e => setAddForm(p => ({ ...p, full_name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                             focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Password *</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={addForm.password}
                  onChange={e => setAddForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                             focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                  placeholder="Min 8 characters"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowAdd(false)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300"
              >Cancel</button>
              <button
                onClick={handleAdd}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium
                           hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {showReset && (
        <div onClick={() => setShowReset(null)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-charcoal">Reset password</h2>
              <button onClick={() => setShowReset(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Setting a new password for <span className="font-medium text-charcoal">{showReset.email}</span>.
            </p>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">New Password *</label>
              <input
                type="password"
                autoComplete="new-password"
                value={resetPassword}
                onChange={e => setResetPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm
                           focus:border-primary focus:ring-1 focus:ring-primary/30 outline-none"
                placeholder="Min 8 characters"
              />
            </div>
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowReset(null)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-gray-300"
              >Cancel</button>
              <button
                onClick={handleResetPassword}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-medium
                           hover:bg-primary-dark disabled:opacity-50"
              >
                {saving ? 'Updating…' : 'Update password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
