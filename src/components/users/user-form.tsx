'use client'

import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import {
  userFormDefaultValues,
  type UserFormValues,
  userFormSchemaWithContact,
} from '@/lib/schemas'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

interface UserFormProps {
  defaultUser?: User
  onSubmit: (values: UserFormValues) => void
  isSubmitting: boolean
  onCancel?: () => void
}

export function UserForm({ defaultUser, onSubmit, isSubmitting, onCancel }: UserFormProps) {
  const isEdit = !!defaultUser

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    resolver: standardSchemaResolver(userFormSchemaWithContact),
    defaultValues: defaultUser 
    ? {
      name: defaultUser.name,
      username: defaultUser.username,
      email: defaultUser.email,
      phone: defaultUser.phone ?? '',
      website: defaultUser.website ? `https://${defaultUser.website}` : '',
      city: defaultUser.address?.city ?? '',
      company: defaultUser.company?.name ?? '',
    } : userFormDefaultValues,
    mode: 'onBlur',
  })

  // useEffect(() => {
  //   if (defaultUser) {
  //     reset({
  //       name: defaultUser.name,
  //       username: defaultUser.username,
  //       email: defaultUser.email,
  //       phone: defaultUser.phone ?? '',
  //       website: defaultUser.website ? `https://${defaultUser.website}` : '',
  //       city: defaultUser.address?.city ?? '',
  //       company: defaultUser.company?.name ?? '',
  //     },{ keepDirty: true })
  //   }
  // }, [defaultUser, reset])


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" >
      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.name}>
          <FieldLabel>Tên *</FieldLabel>
          <Input placeholder="Nguyen Van A" {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>

        <Field data-invalid={!!errors.username}>
          <FieldLabel>Username</FieldLabel>
          <Input placeholder="nguyenvana" {...register('username')} />
          <FieldError errors={[errors.username]} />
        </Field>
      </div>

      <Field data-invalid={!!errors.email}>
        <FieldLabel>Email *</FieldLabel>
        <Input type="email" placeholder="a@example.com" {...register('email')} />
        <FieldError errors={[errors.email]} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.phone}>
          <FieldLabel>Phone</FieldLabel>
          <Input placeholder="0901234567" {...register('phone')} />
          <FieldError errors={[errors.phone]} />
        </Field>

        <Field data-invalid={!!errors.website}>
          <FieldLabel>Website</FieldLabel>
          <Input placeholder="https://example.com" {...register('website')} />
          <FieldError errors={[errors.website]} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field data-invalid={!!errors.company}>
          <FieldLabel>Công ty</FieldLabel>
          <Input placeholder="Acme Corp" {...register('company')} />
          <FieldError errors={[errors.company]} />
        </Field>

        <Field data-invalid={!!errors.city}>
          <FieldLabel>Thành phố</FieldLabel>
          <Input placeholder="Hà Nội" {...register('city')} />
          <FieldError errors={[errors.city]} />
        </Field>
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="submit"
          disabled={isSubmitting ||  (!isDirty)}
          className="flex-1"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? 'Lưu thay đổi' : 'Tạo user'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
      </div>
    </form>
  )
}

