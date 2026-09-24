import { Routes, Route, Navigate } from 'react-router-dom'

import ProtectedRoute from '@/components/ProtectedRoute'
import SuperAdminRoute from '@/components/SuperAdminRoute'
import MenuAccessRoute from '@/components/MenuAccessRoute'

import LoginPage from '@/pages/Login'
import MainLayout from '@/pages/MainLayout'
import Dashboard from '@/pages/Dashboard'
import UsersPage from '@/pages/Users'
import RoleManagementPage from '@/pages/RoleManagement'
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
import AboutPage from '@/pages/AboutPage'
import SkillAcceleratorPageContent from '@/pages/SkillAcceleratorPageContent'
import CourseCatalogPageContent from '@/pages/CourseCatalogPageContent'
import SchedulePageContent from '@/pages/SchedulePageContent'
import TechAdvisoryPageContent from '@/pages/TechAdvisoryPageContent'
import TalentPlacementPageContent from '@/pages/TalentPlacementPageContent'
import ImplementationSupportPageContent from '@/pages/ImplementationSupportPageContent'
import ReadyToUseITProductPageContent from '@/pages/ReadyToUseITProductPageContent'
import CustomAppDevelopmentPageContent from '@/pages/CustomAppDevelopmentPageContent'
import TechnologyCloudLicensingPageContent from '@/pages/TechnologyCloudLicensingPageContent'
import HeroOnlyPageContent from '@/pages/HeroOnlyPageContent'
import PagesIndex from '@/pages/PagesIndex'
import HomePageContent from '@/pages/HomePageContent'
import SchedulePage from '@/pages/Schedule'
import ScheduleFormPage from '@/pages/ScheduleForm'
import ScheduleImportPage from '@/pages/ScheduleImport'
import LearningPathPage from '@/pages/LearningPath'
import LearningPathFormPage from '@/pages/LearningPathForm'

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
        <Route
          path="users"
          element={
            <SuperAdminRoute>
              <UsersPage />
            </SuperAdminRoute>
          }
        />
        <Route
          path="roles"
          element={
            <SuperAdminRoute>
              <RoleManagementPage />
            </SuperAdminRoute>
          }
        />
        <Route
          path="skill-accelerator"
          element={
            <MenuAccessRoute path="/skill-accelerator">
              <SkillAcceleratorPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="skill-accelerator/create"
          element={
            <MenuAccessRoute path="/skill-accelerator">
              <SkillAcceleratorFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="skill-accelerator/:id/edit"
          element={
            <MenuAccessRoute path="/skill-accelerator">
              <SkillAcceleratorFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="course"
          element={
            <MenuAccessRoute path="/course">
              <CoursePage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="course/create"
          element={
            <MenuAccessRoute path="/course">
              <CourseFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="course/:id/edit"
          element={
            <MenuAccessRoute path="/course">
              <CourseFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="master-data"
          element={
            <MenuAccessRoute path="/master-data">
              <MasterDataPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="master-data/:type"
          element={
            <MenuAccessRoute path="/master-data">
              <MasterDataPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="it-product"
          element={
            <MenuAccessRoute path="/it-product">
              <ITProductPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="it-product/create"
          element={
            <MenuAccessRoute path="/it-product">
              <ITProductFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="it-product/:id/edit"
          element={
            <MenuAccessRoute path="/it-product">
              <ITProductFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="app-development"
          element={
            <MenuAccessRoute path="/app-development">
              <AppDevelopmentPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="app-development/create"
          element={
            <MenuAccessRoute path="/app-development">
              <AppDevelopmentFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="app-development/:id/edit"
          element={
            <MenuAccessRoute path="/app-development">
              <AppDevelopmentFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="case-studies"
          element={
            <MenuAccessRoute path="/case-studies">
              <CaseStudyPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="case-studies/create"
          element={
            <MenuAccessRoute path="/case-studies">
              <CaseStudyFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="case-studies/:id/edit"
          element={
            <MenuAccessRoute path="/case-studies">
              <CaseStudyFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="article"
          element={
            <MenuAccessRoute path="/article">
              <ArticlePage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="article/create"
          element={
            <MenuAccessRoute path="/article">
              <ArticleFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="article/:id/edit"
          element={
            <MenuAccessRoute path="/article">
              <ArticleFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="pages"
          element={
            <MenuAccessRoute path="/pages">
              <PagesIndex />
            </MenuAccessRoute>
          }
        />
        <Route
          path="schedule"
          element={
            <MenuAccessRoute path="/schedule">
              <SchedulePage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="schedule/create"
          element={
            <MenuAccessRoute path="/schedule">
              <ScheduleFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="schedule/import"
          element={
            <MenuAccessRoute path="/schedule">
              <ScheduleImportPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="schedule/:id/edit"
          element={
            <MenuAccessRoute path="/schedule">
              <ScheduleFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="learning-path"
          element={
            <MenuAccessRoute path="/learning-path">
              <LearningPathPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="learning-path/create"
          element={
            <MenuAccessRoute path="/learning-path">
              <LearningPathFormPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="learning-path/:id/edit"
          element={
            <MenuAccessRoute path="/learning-path">
              <LearningPathFormPage />
            </MenuAccessRoute>
          }
        />
        <Route path="services" element={<PlaceholderPage title="Services" />} />
        <Route path="strategic-solution" element={<PlaceholderPage title="Strategic Solution" />} />
        <Route path="free-trial" element={<PlaceholderPage title="Free Trial" />} />
        <Route path="promotion" element={<PlaceholderPage title="Promotion" />} />
        <Route
          path="about"
          element={
            <MenuAccessRoute path="/about">
              <AboutPage />
            </MenuAccessRoute>
          }
        />
        <Route
          path="skill-accelerator-page"
          element={
            <MenuAccessRoute path="/skill-accelerator-page">
              <SkillAcceleratorPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="course-catalog-page"
          element={
            <MenuAccessRoute path="/course-catalog-page">
              <CourseCatalogPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="schedule-page"
          element={
            <MenuAccessRoute path="/schedule-page">
              <SchedulePageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="tech-advisory-page"
          element={
            <MenuAccessRoute path="/tech-advisory-page">
              <TechAdvisoryPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="talent-placement-page"
          element={
            <MenuAccessRoute path="/talent-placement-page">
              <TalentPlacementPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="implementation-support-page"
          element={
            <MenuAccessRoute path="/implementation-support-page">
              <ImplementationSupportPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="ready-to-use-it-product"
          element={
            <MenuAccessRoute path="/ready-to-use-it-product">
              <ReadyToUseITProductPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="custom-app-development"
          element={
            <MenuAccessRoute path="/custom-app-development">
              <CustomAppDevelopmentPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="technology-cloud-licensing"
          element={
            <MenuAccessRoute path="/technology-cloud-licensing">
              <TechnologyCloudLicensingPageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="case-study-page"
          element={
            <MenuAccessRoute path="/case-study-page">
              <HeroOnlyPageContent
                pageCode="case-study-page"
                pageTitle="Case Studies"
              />
            </MenuAccessRoute>
          }
        />
        <Route
          path="article-page"
          element={
            <MenuAccessRoute path="/article-page">
              <HeroOnlyPageContent
                pageCode="article-page"
                pageTitle="Article"
              />
            </MenuAccessRoute>
          }
        />
        <Route
          path="home-page"
          element={
            <MenuAccessRoute path="/home-page">
              <HomePageContent />
            </MenuAccessRoute>
          }
        />
        <Route
          path="content"
          element={
            <MenuAccessRoute path="/content">
              <ContentManagementPage />
            </MenuAccessRoute>
          }
        />
        <Route path="blog" element={<PlaceholderPage title="Blog" />} />
        <Route path="career" element={<PlaceholderPage title="Career" />} />
        <Route path="metadata" element={<PlaceholderPage title="Metadata" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
