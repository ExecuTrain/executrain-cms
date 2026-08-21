import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '@/lib/auth'
import LoadingPage from '@/components/LoadingPage'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { state } = useAuth()

  // Masih mengecek auth di awal load
  if (state.isLoading) {
    return <LoadingPage />
  }

  if (!state.hasLogin) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
