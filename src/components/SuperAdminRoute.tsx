import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '@/lib/auth'
import LoadingPage from '@/components/LoadingPage'

/**
 * Guard halaman khusus SUPERADMIN.
 * Non-superadmin diarahkan ke halaman utama.
 */
export default function SuperAdminRoute({ children }: { children: ReactNode }) {
  const { state } = useAuth()

  if (state.isLoading) {
    return <LoadingPage />
  }

  if (!state.user || state.user.role !== 'SUPERADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
