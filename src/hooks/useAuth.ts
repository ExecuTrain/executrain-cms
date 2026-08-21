import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Login, type LoginPayload } from '@/services/auth'
import { useAuth } from '@/lib/auth'

export const useLogin = () => {
  const { actions } = useAuth()

  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (payload: LoginPayload) => {
      const response = await Login(payload)
      return {
        user: {
          id: response.id,
          username: response.username,
          display_name: response.display_name,
          role: response.role,
        },
        token: response.access_token,
      }
    },
    onSuccess: (data) => {
      actions.setAuth(data.user, data.token)
    },
  })
}

export const useLogout = () => {
  const { actions } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      try {
        // Optional: panggil endpoint logout di server jika ada
        return true
      } catch {
        return true
      }
    },
    onSettled: () => {
      actions.logout()
      navigate('/login')
    },
  })
}
