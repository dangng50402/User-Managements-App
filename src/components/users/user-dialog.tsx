"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./user-form";
import type { User } from "@/types/user";
import type { UserFormValues } from "@/lib/schemas";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser?: User | null;
  onSubmit: (values: UserFormValues) => void;
  isSubmitting: boolean;
}

export function UserDialog({
  open,
  onOpenChange,
  editingUser,
  onSubmit,
  isSubmitting,
}: UserDialogProps) {
  const isEdit = !!editingUser;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          sm:max-w-lg
          rounded-2xl
          border
          border-border/60
          bg-white
          p-6
          shadow-2xl
          dark:bg-zinc-900
        "
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEdit ? `Chỉnh sửa: ${editingUser.name}` : "Tạo user mới"}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            {isEdit
              ? "Cập nhật thông tin user bên dưới."
              : "Điền thông tin để tạo user mới."}
          </DialogDescription>
        </DialogHeader>

        <UserForm
          defaultUser={editingUser ?? undefined}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
