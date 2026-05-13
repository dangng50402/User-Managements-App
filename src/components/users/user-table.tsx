// UserTable.tsx
"use client";

import { useState, memo, useCallback } from "react";
import { Pencil, Trash2, MoreHorizontal, Globe, Phone, Users } from "lucide-react";
import { useAuthStore, selectIsAuthenticated } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user";
import { EmptyState } from "../ui/empty-state";
import { ConfirmDialog } from "../ui/confirm-dialog";

interface UserTableProps {
  users: User[];
  isPending: boolean;
  isFetching: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
  search: string;
}

// ─── HighlightText (không đổi) ───────────────────────────────────────────────
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>;
  const regex = new RegExp(
    `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ─── UserRow — tách ra để memo hoạt động theo từng row ───────────────────────
interface UserRowProps {
  user: User;
  search: string;
  isAuthenticated: boolean;
  isDeleting: boolean;
  onEdit: (user: User) => void;
  onRequestDelete: (id: number) => void; // <-- đổi tên để rõ nghĩa
}

const UserRow = memo(function UserRow({
  user,
  search,
  isAuthenticated,
  isDeleting,
  onEdit,
  onRequestDelete,
}: UserRowProps) {
  const isOptimistic = user.id < 0;

  // useCallback bên trong row — stable reference per row instance
  const handleEdit = useCallback(() => onEdit(user), [onEdit, user]);
  const handleRequestDelete = useCallback(
    () => onRequestDelete(user.id),
    [onRequestDelete, user.id]
  );

  return (
    <tr
      className={`hover:bg-muted/30 transition-colors ${
        isOptimistic ? "opacity-50" : ""
      }`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">
              <HighlightText text={user.name} query={search} />
            </p>
            <p className="text-muted-foreground text-xs">
              <HighlightText text={user.email} query={search} />
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 hidden md:table-cell">
        <div className="space-y-1">
          {user.phone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {user.phone}
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              {user.website}
            </div>
          )}
        </div>
      </td>

      <td className="px-4 py-3 hidden lg:table-cell">
        <div>
          <p className="text-sm">
            <HighlightText text={user.company.name} query={search} />
          </p>
          <p className="text-xs text-muted-foreground">{user.address.city}</p>
        </div>
      </td>

      {isAuthenticated && (
        <td className="px-4 py-3 text-right">
          {isOptimistic ? (
            <Badge variant="secondary" className="text-xs">
              Đang xử lý...
            </Badge>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={isDeleting}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleRequestDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </td>
      )}
    </tr>
  );
});

// ─── UserTable ────────────────────────────────────────────────────────────────
export function UserTable({
  users,
  isPending,
  onEdit,
  onDelete,
  isDeleting,
  search,
}: UserTableProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // useCallback ở đây để onEdit/onRequestDelete stable → UserRow không re-render
  const handleEdit = useCallback((user: User) => onEdit(user), [onEdit]);
  const handleRequestDelete = useCallback(
    (id: number) => setDeleteTargetId(id),
    [] // setDeleteTargetId là stable, không cần deps
  );
  const handleConfirmDelete = useCallback(() => {
    if (deleteTargetId !== null) {
      onDelete(deleteTargetId);
      setDeleteTargetId(null);
    }
  }, [deleteTargetId, onDelete]);

  if (isPending) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-10 w-10" />}
        title="Không tìm thấy user nào"
        description={
          search
            ? `Không có kết quả nào cho "${search}". Thử từ khóa khác.`
            : "Thử thay đổi bộ lọc hoặc tạo user mới."
        }
      />
    );
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                User
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">
                Liên hệ
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">
                Công ty
              </th>
              {isAuthenticated && (
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                  Hành động
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                search={search}
                isAuthenticated={isAuthenticated}
                isDeleting={isDeleting}
                onEdit={handleEdit}
                onRequestDelete={handleRequestDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="Xác nhận xóa"
        description="Hành động này không thể hoàn tác. User sẽ bị xóa vĩnh viễn."
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}