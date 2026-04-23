import { z } from 'zod'

// ─── Schema cơ bản ────────────────────────────────────────────────────────────
export const userFormSchema = z.object({
  name: z
    .string({
      // v4: dùng error callback thay required_error / invalid_type_error
      error: (issue) =>
        issue.input === undefined ? 'Tên là bắt buộc' : 'Phải là chuỗi ký tự',
    })
    .min(2, 'Tên ít nhất 2 ký tự')
    .max(50, 'Tối đa 50 ký tự')
    .trim(),

  username: z
    .string()
    .min(3, 'Username ít nhất 3 ký tự')
    .max(20, 'Tối đa 20 ký tự')
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Chỉ dùng chữ, số và _' })
    .optional()
    .or(z.literal('')),

  email: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Email là bắt buộc' : 'Phải là chuỗi ký tự',
    })
    .toLowerCase()
    .pipe(z.email('Email không hợp lệ')),
    // ✅ v4: z.email() thay vì z.string().email()
    // Hoặc đơn giản hơn cho form (không cần .pipe):
    // z.email({ error: 'Email không hợp lệ' })

  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,15}$/, 'Số điện thoại không hợp lệ')
    .optional()
    .or(z.literal('')),

  website: z
    // ✅ v4: z.url() top-level thay vì z.string().url()
    .url('Website phải là URL hợp lệ (VD: https://example.com)')
    .optional()
    .or(z.literal('')),

  city: z.string().max(50, 'Tối đa 50 ký tự').optional().or(z.literal('')),

  company: z.string().max(100, 'Tối đa 100 ký tự').optional().or(z.literal('')),
})

// ─── Cross-field validation với .check() (v4 thay .superRefine()) ─────────────
export const userFormSchemaWithContact = userFormSchema
  .check((ctx) => {
    const hasPhone = ctx.value.phone && ctx.value.phone.trim() !== ''
    const hasWebsite = ctx.value.website && ctx.value.website.trim() !== ''

    if (!hasPhone && !hasWebsite) {
      // v4: push vào ctx.issues, dùng code: 'custom' (string, không phải enum)
      ctx.issues.push({
        code: 'custom',
        message: 'Phải có ít nhất Phone hoặc Website',
        path: ['phone'],
        input: ctx.value,
      })
      ctx.issues.push({
        code: 'custom',
        message: 'Phải có ít nhất Phone hoặc Website',
        path: ['website'],
        input: ctx.value,
      })
    }
  })

// ─── Types — không đổi ────────────────────────────────────────────────────────
export type UserFormValues = z.infer<typeof userFormSchema>

export const userFormDefaultValues: UserFormValues = {
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  city: '',
  company: '',
}

// ─── Login schema ─────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  name: z.string().min(2, 'Tên ít nhất 2 ký tự'),
  // ✅ v4: z.email() thay z.string().email()
  email: z.email('Email không hợp lệ'),
})

export type LoginFormValues = z.infer<typeof loginSchema>