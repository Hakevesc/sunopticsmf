'use client'
import { supabase } from './supabase'

export interface AdminSession {
  id: string
  email: string
  full_name: string | null
}

const STORAGE_KEY = 'sunoptics_admin_session'

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as AdminSession
  } catch {
    return null
  }
}

export function setAdminSession(session: AdminSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(STORAGE_KEY)
}

export async function adminLogin(email: string, password: string): Promise<AdminSession> {
  const { data, error } = await supabase.rpc('admin_login', {
    p_email: email,
    p_password: password,
  })
  if (error) {
    throw new Error(error.message || 'Login failed')
  }
  const row = Array.isArray(data) ? data[0] : data
  if (!row || !row.id) {
    throw new Error('Invalid email or password')
  }
  const session: AdminSession = {
    id: row.id,
    email: row.email,
    full_name: row.full_name ?? null,
  }
  setAdminSession(session)
  return session
}
