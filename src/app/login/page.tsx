'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore, selectIsAuthenticated } from '@/stores/auth-store'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const router = useRouter()

  // Redirect nếu đã login
  useEffect(() => {
    if (isAuthenticated) router.replace('/')
  }, [isAuthenticated, router])

  return <LoginForm />
}