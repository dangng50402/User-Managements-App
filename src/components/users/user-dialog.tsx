'use client'

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { UserForm } from './user-form'
import type { User } from '@/types/user'
import type { UserFormValues } from '@/lib/schemas'

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser?: User | null
  onSubmit: (values: UserFormValues) => void
  isSubmitting: boolean
}

export function UserDialog({
  open,
  onOpenChange,
  editingUser,
  onSubmit,
  isSubmitting,
}: UserDialogProps) {
  const isEdit = !!editingUser

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Chỉnh sửa: ${editingUser.name}` : 'Tạo user mới'}
          </DialogTitle>
        </DialogHeader>
        <UserForm
          defaultUser={editingUser ?? undefined}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}