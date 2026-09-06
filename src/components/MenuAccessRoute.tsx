import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { useAuth } from '@/lib/auth'
import { useMyMenus } from '@/hooks/useAccess'
import LoadingPage from '@/components/LoadingPage'

/**
 * Guard halaman berdasarkan menu permission role user.
 * - SUPERADMIN: selalu lolos.
 * - Role lain: dicek apakah path ada di daftar menu (my-menus).
 *   Kalau tidak punya akses, arahkan ke "/".
 */
export default function MenuAccessRoute({
  path,
  children,
}: {
  path: string
  children: ReactNode
}) {
  const { state } = useAuth()
  const { data: myMenus, isLoading: menusLoading } = useMyMenus()

  if (state.isLoading) {
    return <LoadingPage />
  }

  if (!state.hasLogin) {
    return <Navigate to="/login" replace />
  }

  const isSuper = state.user?.role === 'SUPERADMIN'
  if (isSuper) {
    return <>{children}</>
  }

  if (menusLoading) {
    return <LoadingPage />
  }

  const hasAccess = (myMenus?.menus ?? []).some((menu: any) => {
    if (menu.path === path) return true
    if (menu.children) {
      return menu.children.some((child: any) => child.path === path)
    }
    return false
  })

  if (!hasAccess) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
