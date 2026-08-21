import { Home, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MenuItem {
  id: number
  text: string
  icon: LucideIcon
  href?: string
  children?: MenuItem[]
}

/**
 * Menu untuk role selain SUPERADMIN — hanya Home.
 */
export const DefaultMenu: MenuItem[] = [
  { id: 1, text: 'Home', icon: Home, href: '/' },
]

/**
 * Menu untuk SUPERADMIN — Home + Users.
 */
export const SuperMenu: MenuItem[] = [
  { id: 1, text: 'Home', icon: Home, href: '/' },
  { id: 2, text: 'Users', icon: Users, href: '/users' },
]
