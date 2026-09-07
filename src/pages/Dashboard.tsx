import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import Image from '@/components/Image'
import { useAuth } from '@/lib/auth'
import { useMyMenus } from '@/hooks/useAccess'
import { buildMenuFromTree, type MenuItem } from '@/lib/menu'
import { colors } from '@/lib/constants'
import { DashboardSkeleton } from '@/components/Skeletons'

/**
 * Kartu menu tunggal.
 * - item: menu yang dirender
 * - color: warna aksen (dipakai icon + background icon)
 */
function MenuCard({ item, color }: { item: MenuItem; color: string }) {
  const Icon = item.icon
  return (
    <Link
      to={item.href || '#'}
      key={item.id}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">{item.text}</p>
        </div>
        {Icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        )}
      </div>
    </Link>
  )
}

/**
 * Dashboard menampilkan menu sesuai role user (diambil dari my-menus,
 * sama seperti sidebar). Role non-super hanya melihat menu yang diizinkan.
 */
export default function Dashboard() {
  const { state } = useAuth()
  const { data: myMenus, isFetched } = useMyMenus()
  const [menuList, setMenuList] = useState<MenuItem[]>([])

  useEffect(() => {
    if (isFetched && myMenus && myMenus.menus.length > 0) {
      setMenuList(buildMenuFromTree(myMenus.menus))
    }
  }, [isFetched, myMenus])

  // Menu tanpa children → kartu standalone (Home, Users, Content, Master Data)
  const standaloneMenus = menuList.filter(
    (m) => m.href && (!m.children || m.children.length === 0),
  )
  // Menu dengan children → grup (Catalog, Tech Solution, Insight)
  const groupedMenus = menuList.filter(
    (m) => m.children && m.children.length > 0,
  )

  return (
    <div className="flex flex-col items-center gap-8 min-h-[90dvh] pt-10 pb-10">
      <div className="flex flex-col items-center">
        <div>
          <Image src="/logo-colored.png" alt="logo" width={500} height={200} />
        </div>
        <p className="text-gray-600 mt-1">
          Welcome {state?.user?.display_name ?? 'Admin'}, Let's Manage Your
          Company Profile Here
        </p>
      </div>

      {!isFetched ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-8 w-full">
          {/* Standalone menus */}
          {standaloneMenus.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
              {standaloneMenus.map((menu, index) => (
                <MenuCard
                  key={menu.id}
                  item={menu}
                  color={colors[index % colors.length]}
                />
              ))}
            </div>
          )}

          {/* Grouped menus — samakan mapping dengan sidebar */}
          {groupedMenus.map((group, groupIndex) => {
            const GroupIcon = group.icon
            const groupColor = colors[groupIndex % colors.length]
            return (
              <section key={group.id} className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  {GroupIcon && (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${groupColor}20` }}
                    >
                      <GroupIcon
                        className="w-4 h-4"
                        style={{ color: groupColor }}
                      />
                    </div>
                  )}
                  <h2 className="text-sm font-semibold text-gray-900">
                    {group.text}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {group.children?.length ?? 0} menu
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                  {group.children?.map((child) => (
                    <MenuCard key={child.id} item={child} color={groupColor} />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
