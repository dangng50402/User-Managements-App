'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { loginSchema, type LoginFormValues } from '@/lib/schemas'
import { Field, FieldContent, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const login = useAuthStore((state) => state.login)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { name: '', email: '' },
  })

  const onSubmit = handleSubmit(({ name, email }) => {
    login(name, email)
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-semibold">Đăng nhập</h1>
          <p className="mt-1 text-sm text-slate-500">
            Đây là demo auth — không có server thật
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Tên</FieldLabel>
              <FieldContent>
                <Input placeholder="Nguyen Van A" {...register('name')} />
              </FieldContent>
              <FieldError>{errors.name?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>
              <FieldContent>
                <Input type="email" placeholder="a@example.com" {...register('email')} />
              </FieldContent>
              <FieldError>{errors.email?.message}</FieldError>
            </Field>

            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Đăng nhập
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}