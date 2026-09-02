import { Home, Users, BookOpen, LayoutGrid, GraduationCap, Database, Cpu, Boxes, AppWindow, Newspaper, FolderOpen, Settings2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { MASTER_DATA_TYPES } from './masterDataTypes'

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
 * Menu untuk SUPERADMIN — Home + Users + Catalog (dengan submenu).
 */
export const SuperMenu: MenuItem[] = [
  { id: 1, text: 'Home', icon: Home, href: '/' },
  { id: 2, text: 'Users', icon: Users, href: '/users' },
  {
    id: 3,
    text: 'Catalog',
    icon: LayoutGrid,
    children: [
      { id: 31, text: 'Skill Accelerator', icon: BookOpen, href: '/skill-accelerator' },
      { id: 32, text: 'Course', icon: GraduationCap, href: '/course' },
    ],
  },
  {
    id: 5,
    text: 'Tech Solution',
    icon: Boxes,
    children: [
      { id: 51, text: 'IT Product', icon: Cpu, href: '/it-product' },
      { id: 52, text: 'App Development', icon: AppWindow, href: '/app-development' },
    ],
  },
  {
    id: 6,
    text: 'Insight',
    icon: Newspaper,
    children: [
      { id: 61, text: 'Case Studies', icon: FolderOpen, href: '/case-studies' },
      { id: 62, text: 'Article', icon: Newspaper, href: '/article' },
    ],
  },
  {
    id: 7,
    text: 'Content',
    icon: Settings2,
    href: '/content',
  },
  {
    id: 4,
    text: 'Master Data',
    icon: Database,
    children: MASTER_DATA_TYPES.map((m) => ({
      id: 40 + MASTER_DATA_TYPES.findIndex((x) => x.path === m.path),
      text: m.label,
      icon: m.icon,
      href: `/master-data/${m.path}`,
    })),
  },
]