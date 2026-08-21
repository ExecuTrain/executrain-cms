import { Form } from 'antd'
import Image from '@/components/Image'
import { User, Lock, LogIn } from 'lucide-react'

import { useLogin } from '@/hooks/useAuth'
import { useAuth } from '@/lib/auth'
import InputForm from '@/components/Form'
import Notification from '@/components/Notification'

import { Navigate, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { state } = useAuth()
  const navigate = useNavigate()
  const [formAction] = Form.useForm()

  const { mutate, isPending } = useLogin()

  // Sudah login? Langsung ke dashboard
  if (state.hasLogin) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async () => {
    try {
      await formAction.validateFields()

      const payload = formAction.getFieldsValue()

      mutate(payload, {
        onSuccess() {
          Notification('success', 'Login Success')
          navigate('/')
        },
        onError(error: any) {
          Notification('error', error.message || 'Login Failed')
        },
      })
    } catch {
      Notification('error', 'Please fill in all required fields')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center min-w-full">
      <div
        style={{
          backgroundImage: `url('./banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        className="w-1/2 h-[100dvh]"
      ></div>
      <div className="w-1/2 p-10 flex items-center justify-center flex-col">
        {/* Login Form */}
        <div className="p-8 w-[80%]">
          <Form
            form={formAction}
            onFinish={handleLogin}
            layout="vertical"
            className="space-y-6"
            requiredMark={false}
          >
            <div className="flex items-center justify-center mt-5 mb-10">
              <Image
                src="/logo-colored.png"
                alt="logo"
                width={350}
                height={200}
              />
            </div>
            <InputForm
              type="text"
              name="username"
              placeholder="Enter your username"
              label="Username"
              icon={<User className="w-5 h-5 text-gray-600" />}
              required
              className="mb-0"
            />

            <InputForm
              type="password"
              name="password"
              placeholder="Enter your password"
              label="Password"
              icon={<Lock className="w-5 h-5 text-gray-600" />}
              required
              className="mb-0"
            />

            <button
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </Form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Secure dashboard access for authorized users only
          </p>
        </div>
      </div>
    </div>
  )
}
