import { useState } from 'react'



import StatisticsTab from '@/pages/content-tabs/StatisticsTab'
import PartnersTab from '@/pages/content-tabs/PartnersTab'
import TestimonialsTab from '@/pages/content-tabs/TestimonialsTab'
import SocialMediaTab from '@/pages/content-tabs/SocialMediaTab'
import AssetsTab from '@/pages/content-tabs/AssetsTab'
import GalleryTab from '@/pages/content-tabs/GalleryTab'
import CareerTab from '@/pages/content-tabs/CareerTab'

const tabs = [
  { id: 'statistics', name: 'Statistics' },
  { id: 'partners', name: 'Partners' },
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'socmed', name: 'Social Media' },
  { id: 'assets', name: 'Assets' },
  { id: 'gallery', name: 'Gallery' },
  { id: 'career', name: 'Career' },
]

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState('statistics')

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Content Management</h1>
          <p className="text-xs text-gray-600 mt-0.5">
            Manage website content, statistics, and metadata
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center border-b-2 border-transparent gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap duration-150 text-xs ${
                  activeTab === tab.id
                    ? 'text-primary-500 !border-primary-500 font-semibold'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'statistics' && <StatisticsTab />}
          {activeTab === 'partners' && <PartnersTab />}
          {activeTab === 'testimonials' && <TestimonialsTab />}
          {activeTab === 'socmed' && <SocialMediaTab />}
          {activeTab === 'assets' && <AssetsTab />}
          {activeTab === 'gallery' && <GalleryTab />}
          {activeTab === 'career' && <CareerTab />}
        </div>
      </div>
    </div>
  )
}
