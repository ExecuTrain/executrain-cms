import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Login, type LoginPayload } from '@/services/auth'
import { useAuth } from '@/lib/auth'

export const useLogin = () => {
  const { actions } = useAuth()
  const queryClient = useQueryClient()

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
      // Bersihkan cache query (mis. my-menus user sebelumnya) supaya menu
      // user baru di-fetch ulang dan tidak bocor antar akun.
      queryClient.clear()
      actions.setAuth(data.user, data.token)
    },
  })
}

export const useLogout = () => {
  const { actions } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

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
      queryClient.clear()
      actions.logout()
      navigate('/login')
    },
  })
}
