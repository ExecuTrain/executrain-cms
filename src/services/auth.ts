import AxiosClient from '@/lib/axios'

export interface LoginPayload {
  username: string
  password: string
}

export interface LoginResponse {
  status: number
  message: string
  id: string
  username: string
  display_name?: string
  role: string
  access_token: string
}

export async function Login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    const { data } = await AxiosClient.post<LoginResponse>('/auth/login', payload)

    if (data.status !== 200) {
      throw new Error(data.message || 'Login Failed')
    }

    return data
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Login Failed'
    throw new Error(message)
  }
}
