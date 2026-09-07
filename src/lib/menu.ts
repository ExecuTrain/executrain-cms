import {
  Home,
  Users,
  BookOpen,
  LayoutGrid,
  GraduationCap,
  CalendarDays,
  Database,
  Cpu,
  Boxes,
  AppWindow,
  Newspaper,
  FolderOpen,
  FolderSearch,
  Settings2,
  Shield,
  FileText,
  KeyRound,
  Info,
  FileStack,
  Zap,
  Compass,
  UsersRound,
  LifeBuoy,
  Package,
  Cloud,
  type LucideIcon,
} from 'lucide-react'
import { MASTER_DATA_TYPES } from './masterDataTypes'

export interface MenuItem {
  id: number
  text: string
  icon: LucideIcon
  href?: string
  children?: MenuItem[]
}

/**
 * Peta kode menu (dari tabel Menu di server) -> ikon lucide.
 * Dipakai utk membangun sidebar dinamis dari /access/my-menus.
 */
const MENU_ICONS: Record<string, LucideIcon> = {
  home: Home,
  users: Users,
  roles: Shield,
  access: KeyRound,
  catalog: LayoutGrid,
  'skill-accelerator': BookOpen,
  course: GraduationCap,
  schedule: CalendarDays,
  'tech-solution': Boxes,
  'it-product': Cpu,
  'app-development': AppWindow,
  insight: Newspaper,
  'case-studies': FolderOpen,
  article: FileText,
  content: Settings2,
  'master-data': Database,
  pages: FileStack,
  about: Info,
  'skill-accelerator-page': Zap,
  'course-catalog-page': GraduationCap,
  'tech-advisory-page': Compass,
  'talent-placement-page': UsersRound,
  'implementation-support-page': LifeBuoy,
  'ready-to-use-it-product': Package,
  'custom-app-development': AppWindow,
  'technology-cloud-licensing': Cloud,
  'case-study-page': FolderSearch,
  'article-page': Newspaper,
  'home-page': Home,
}

export function getMenuIcon(code: string): LucideIcon {
  return MENU_ICONS[code] || FileText
}

/**
 * Konversi tree menu dari server (dari /access/my-menus) menjadi
 * MenuItem[] yg siap di-render oleh Sidebar.
 *
 * @param tree - array node {code,label,path,children} dari API
 * @param startId - offset numeric id utk React key
 */
export function buildMenuFromTree(
  tree: Array<{ code: string; label: string; path: string | null; children?: any[] }>,
  startId = 1,
): MenuItem[] {
  let id = startId
  return tree.map((node) => {
    const current = id++
    const item: MenuItem = {
      id: current,
      text: node.label,
      icon: getMenuIcon(node.code),
    }
    if (node.path) {
      item.href = node.path
    }
    // Parent yang punya path (mis. "pages" dengan /pages) dirender sebagai
    // item leaf — halaman index-nya menampilkan grid, seperti Master Data.
    const isIndexedParent = Boolean(node.path) && Boolean(node.children?.length)
    if (node.children && node.children.length > 0 && !isIndexedParent) {
      item.children = node.children.map((child) => ({
        id: id++,
        text: child.label,
        icon: getMenuIcon(child.code),
        href: child.path || undefined,
      }))
    }
    return item
  })
}

/**
 * Fallback menu bawaan utk role yg belum punya akses server,
 * atau saat request my-menus gagal. SUPERADMIN otomatis dapat semua
 * menu dr server; fallback ini hanya jaring pengaman.
 */
export const DefaultMenu: MenuItem[] = [
  { id: 1, text: 'Home', icon: Home, href: '/' },
]

/**
 * Menu default SUPERADMIN (fallback bila server tidak merespons).
 */
export const SuperMenu: MenuItem[] = [
  { id: 1, text: 'Home', icon: Home, href: '/' },
  {
    id: 2,
    text: 'Access',
    icon: KeyRound,
    children: [
      { id: 21, text: 'Users', icon: Users, href: '/users' },
      { id: 22, text: 'Role Management', icon: Shield, href: '/roles' },
    ],
  },
  {
    id: 3,
    text: 'Catalog',
    icon: LayoutGrid,
    children: [
      { id: 31, text: 'Skill Accelerator', icon: BookOpen, href: '/skill-accelerator' },
      { id: 32, text: 'Course', icon: GraduationCap, href: '/course' },
      { id: 33, text: 'Schedule', icon: CalendarDays, href: '/schedule' },
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
      { id: 62, text: 'Article', icon: FileText, href: '/article' },
    ],
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
  {
    id: 8,
    text: 'Pages',
    icon: FileStack,
    href: '/pages',
  },
]