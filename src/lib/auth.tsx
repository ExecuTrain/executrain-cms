import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react'

import AxiosClient from './axios'
import { LocalToken, LocalRefreshToken } from './constants'

export interface AuthUser {
  id: string
  username: string
  display_name?: string
  role: string
  access_token?: string
}

interface AuthState {
  hasLogin: boolean
  user: AuthUser | null
  token?: string
  isLoading: boolean
}

interface AuthActions {
  setAuth: (user: AuthUser | null, token: string) => void
  setToken: (token: string) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  checkAuth: () => Promise<boolean>
}

interface AuthContextValue {
  state: AuthState
  actions: AuthActions
}

const initialState: AuthState = {
  hasLogin: false,
  user: null,
  token: undefined,
  isLoading: true,
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type Action =
  | { type: 'SET_AUTH'; payload: { user: AuthUser | null; token?: string } }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' }

function authReducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'SET_AUTH':
      return {
        ...state,
        hasLogin: !!action.payload.user,
        user: action.payload.user,
        token: action.payload.token || state.token,
        isLoading: false,
      }
    case 'SET_TOKEN':
      return { ...state, token: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGOUT':
      return { ...initialState, isLoading: false }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const actions: AuthActions = {
    setAuth: (user, token) => {
      dispatch({ type: 'SET_AUTH', payload: { user, token } })
      if (token) AxiosClient.setTokens(token)
    },

    setToken: (token) => {
      dispatch({ type: 'SET_TOKEN', payload: token })
      AxiosClient.setTokens(token)
    },

    setLoading: (loading) => {
      dispatch({ type: 'SET_LOADING', payload: loading })
    },

    logout: () => {
      dispatch({ type: 'LOGOUT' })
      AxiosClient.clearTokens()
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LocalToken)
        localStorage.removeItem(LocalRefreshToken)
      }
    },

    checkAuth: async () => {
      try {
        actions.setLoading(true)

        if (!AxiosClient.isAuthenticated()) {
          actions.setLoading(false)
          return false
        }

        const { data } = await AxiosClient.get('/auth/me')

        const { status, ...user } = data

        if (status === 200 && user.id) {
          actions.setAuth(user, user.access_token)
          return true
        }

        actions.logout()
        return false
      } catch (error) {
        console.error('Auth check failed:', error)
        actions.logout()
        return false
      } finally {
        actions.setLoading(false)
      }
    },
  }

  useEffect(() => {
    actions.checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ state, actions }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
