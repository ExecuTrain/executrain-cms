export const LocalToken = 'excutrain_auth_token'
export const LocalRefreshToken = 'excutrain_refresh_token'

export const API_BASE = import.meta.env.VITE_API_URL || '/api/v2'

/** Path yang memerlukan autentikasi (dipakai oleh protected routes) */
export const ValidPath = ['', 'users', 'services', 'schedule', 'content']

export const colors = [
  '#BE0F34', // Cyan
  '#D0229F', // Magenta
  '#7C3AED', // Purple
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#10B981', // Green
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#8B5CF6', // Violet
  '#14B8A6', // Teal
  '#F97316', // Deep Orange
  '#06B6D4', // Sky Blue
]
