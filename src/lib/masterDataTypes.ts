import {
  Tags,
  Server,
  Braces,
  GitBranch,
  Tag,
  Factory,
  Lightbulb,
  Cloud,
  Newspaper,
  Workflow,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface MasterDataType {
  /** Nilai `type` di tabel MasterData */
  type: string
  /** Label untuk menu & judul halaman */
  label: string
  /** Segment path di bawah /master-data */
  path: string
  icon: LucideIcon
}

/**
 * Daftar tipe master data yang dikelola di CMS.
 * Dipakai bersama oleh menu sidebar dan halaman /master-data/:type.
 */
export const MASTER_DATA_TYPES: MasterDataType[] = [
  { type: 'SKILL_CATEGORY', label: 'Skill Accelerator Category', path: 'skill-category', icon: Tags },
  {
    type: 'FRAMEWORK_ITEM',
    label: 'Framework Diagram Item',
    path: 'framework-item',
    icon: Workflow,
  },
  { type: 'TECH_STACK', label: 'Tech Stack (IT Product)', path: 'tech-stack', icon: Server },
  { type: 'APP_TECH_STACK', label: 'Tech Stack (App Development)', path: 'app-tech-stack', icon: Braces },
  { type: 'APP_METHODOLOGY', label: 'Methodology (App Development)', path: 'app-methodology', icon: GitBranch },
  { type: 'CASE_CATEGORY', label: 'Case Study Category', path: 'case-category', icon: Tag },
  { type: 'CASE_INDUSTRY', label: 'Industry', path: 'case-industry', icon: Factory },
  { type: 'CASE_SOLUTION', label: 'Solution', path: 'case-solution', icon: Lightbulb },
  { type: 'CASE_METHODOLOGY', label: 'Methodology (Case Study)', path: 'case-methodology', icon: GitBranch },
  { type: 'CASE_DEPLOYMENT', label: 'Deployment Type', path: 'case-deployment', icon: Cloud },
  { type: 'ARTICLE_CATEGORY', label: 'Article Category', path: 'article-category', icon: Newspaper },
]
