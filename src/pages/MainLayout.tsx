import { Outlet } from 'react-router-dom'

import Sidebar from '@/components/Sidebar'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 grow">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
