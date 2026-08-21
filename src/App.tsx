import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from '@/components/ProtectedRoute'
import SuperAdminRoute from '@/components/SuperAdminRoute'

import LoginPage from '@/pages/Login'
import MainLayout from '@/pages/MainLayout'
import Dashboard from '@/pages/Dashboard'
import UsersPage from '@/pages/Users'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500">
        Modul ini sedang disiapkan. Struktur & fitur akan menyusul.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<SuperAdminRoute><UsersPage /></SuperAdminRoute>} />
        <Route path="services" element={<PlaceholderPage title="Services" />} />
        <Route path="strategic-solution" element={<PlaceholderPage title="Strategic Solution" />} />
        <Route path="free-trial" element={<PlaceholderPage title="Free Trial" />} />
        <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
        <Route path="promotion" element={<PlaceholderPage title="Promotion" />} />
        <Route path="content" element={<PlaceholderPage title="Content Management" />} />
        <Route path="blog" element={<PlaceholderPage title="Blog" />} />
        <Route path="career" element={<PlaceholderPage title="Career" />} />
        <Route path="metadata" element={<PlaceholderPage title="Metadata" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
