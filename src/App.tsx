import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from '@/components/ProtectedRoute'
import SuperAdminRoute from '@/components/SuperAdminRoute'

import LoginPage from '@/pages/Login'
import MainLayout from '@/pages/MainLayout'
import Dashboard from '@/pages/Dashboard'
import UsersPage from '@/pages/Users'
import SkillAcceleratorPage from '@/pages/SkillAccelerator'
import SkillAcceleratorFormPage from '@/pages/SkillAcceleratorForm'
import CoursePage from '@/pages/Course'
import CourseFormPage from '@/pages/CourseForm'
import MasterDataPage from '@/pages/MasterData'
import ITProductPage from '@/pages/ITProduct'
import ITProductFormPage from '@/pages/ITProductForm'
import AppDevelopmentPage from '@/pages/AppDevelopment'
import AppDevelopmentFormPage from '@/pages/AppDevelopmentForm'
import CaseStudyPage from '@/pages/CaseStudy'
import CaseStudyFormPage from '@/pages/CaseStudyForm'
import ArticlePage from '@/pages/Article'
import ArticleFormPage from '@/pages/ArticleForm'
import ContentManagementPage from '@/pages/ContentManagement'

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
        <Route path="skill-accelerator" element={<SuperAdminRoute><SkillAcceleratorPage /></SuperAdminRoute>} />
        <Route path="skill-accelerator/create" element={<SuperAdminRoute><SkillAcceleratorFormPage /></SuperAdminRoute>} />
        <Route path="skill-accelerator/:id/edit" element={<SuperAdminRoute><SkillAcceleratorFormPage /></SuperAdminRoute>} />
        <Route path="course" element={<SuperAdminRoute><CoursePage /></SuperAdminRoute>} />
        <Route path="course/create" element={<SuperAdminRoute><CourseFormPage /></SuperAdminRoute>} />
        <Route path="course/:id/edit" element={<SuperAdminRoute><CourseFormPage /></SuperAdminRoute>} />
        <Route path="master-data" element={<SuperAdminRoute><MasterDataPage /></SuperAdminRoute>} />
        <Route path="master-data/:type" element={<SuperAdminRoute><MasterDataPage /></SuperAdminRoute>} />
        <Route path="it-product" element={<SuperAdminRoute><ITProductPage /></SuperAdminRoute>} />
        <Route path="it-product/create" element={<SuperAdminRoute><ITProductFormPage /></SuperAdminRoute>} />
        <Route path="it-product/:id/edit" element={<SuperAdminRoute><ITProductFormPage /></SuperAdminRoute>} />
        <Route path="app-development" element={<SuperAdminRoute><AppDevelopmentPage /></SuperAdminRoute>} />
        <Route path="app-development/create" element={<SuperAdminRoute><AppDevelopmentFormPage /></SuperAdminRoute>} />
        <Route path="app-development/:id/edit" element={<SuperAdminRoute><AppDevelopmentFormPage /></SuperAdminRoute>} />
        <Route path="case-studies" element={<SuperAdminRoute><CaseStudyPage /></SuperAdminRoute>} />
        <Route path="case-studies/create" element={<SuperAdminRoute><CaseStudyFormPage /></SuperAdminRoute>} />
        <Route path="case-studies/:id/edit" element={<SuperAdminRoute><CaseStudyFormPage /></SuperAdminRoute>} />
        <Route path="article" element={<SuperAdminRoute><ArticlePage /></SuperAdminRoute>} />
        <Route path="article/create" element={<SuperAdminRoute><ArticleFormPage /></SuperAdminRoute>} />
        <Route path="article/:id/edit" element={<SuperAdminRoute><ArticleFormPage /></SuperAdminRoute>} />
        <Route path="services" element={<PlaceholderPage title="Services" />} />
        <Route path="strategic-solution" element={<PlaceholderPage title="Strategic Solution" />} />
        <Route path="free-trial" element={<PlaceholderPage title="Free Trial" />} />
        <Route path="schedule" element={<PlaceholderPage title="Schedule" />} />
        <Route path="promotion" element={<PlaceholderPage title="Promotion" />} />
        <Route path="content" element={<SuperAdminRoute><ContentManagementPage /></SuperAdminRoute>} />
        <Route path="blog" element={<PlaceholderPage title="Blog" />} />
        <Route path="career" element={<PlaceholderPage title="Career" />} />
        <Route path="metadata" element={<PlaceholderPage title="Metadata" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
