"use client"

import { useState, useCallback, useRef } from "react"  // ← thêm useCallback
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useAuthStore, selectIsAuthenticated } from "@/stores/auth-store"
import { useTableQueryState } from "@/hooks/use-table-query-state"
import { useUsers }      from "@/hooks/use-users"
import { useCreateUser } from "@/hooks/use-create-user"
import { useUpdateUser } from "@/hooks/use-update-user"
import { useDeleteUser } from "@/hooks/use-delete-user"
import { UserToolbar }   from "@/components/users/user-toolbar"
import { UserTable }     from "@/components/users/user-table"
import { UserDialog }    from "@/components/users/user-dialog"
import { useDebounce }   from "@/hooks/use-debounce"
import type { User, UpdateUserInput, CreateUserInput, SortField, SortOrder } from "@/types/user"
import type { UserFormValues } from "@/lib/schemas"

export function UsersPageClient() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const router = useRouter()

  const { query, status, sort, order, setQuery, setStatus, setSort } =
    useTableQueryState()

  const [inputValue, setInputValue] = useState(query)
  const debouncedQ = useDebounce(inputValue, 400)
  const [dialogOpen,  setDialogOpen]  = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const {
    users, totalCount, filteredCount,
    isPending, isError, error, isFetching,
  } = useUsers({
    search:    debouncedQ,
    filter:    status,
    sortField: sort,
    sortOrder: order,
  })

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  // ✅ useCallback — deps rỗng vì chỉ dùng stable refs
  const handleCreateClick = useCallback(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này")
      router.replace("/login")
      return
    }
    setEditingUser(null)
    setDialogOpen(true)
  }, [isAuthenticated, router])

  // ✅ useCallback — không tạo function mới mỗi render
  const handleEdit = useCallback((user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }, []) // setEditingUser, setDialogOpen là stable

  // ✅ FIX CHÍNH — đây là thủ phạm gây UserTable re-render
  const handleDelete = useCallback((id: number) => {
    deleteMutation.mutate(id)
  }, [deleteMutation.mutate])

  // ✅ useCallback — editingUser thay đổi khi user chọn edit
  const handleDialogSubmit = useCallback((values: UserFormValues) => {
    if (editingUser) {
      const updateData: UpdateUserInput = {
        id:       editingUser.id,
        name:     values.name,
        username: values.username ?? "",
        email:    values.email,
        phone:    values.phone ?? "",
        website:  values.website ?? "",
        address:  { ...editingUser.address, city: values.city ?? "" },
        company:  { ...editingUser.company, name: values.company ?? "" },
      }
      updateMutation.mutate(
        { id: updateData.id, data: updateData },
        { onSuccess: () => setDialogOpen(false) }
      )
    } else {
      const createData: CreateUserInput = {
        name:     values.name,
        username: values.username ?? "",
        email:    values.email,
        phone:    values.phone,
        website:  values.website,
      }
      createMutation.mutate(createData, {
        onSuccess: () => setDialogOpen(false),
      })
    }
  }, [editingUser, updateMutation, createMutation])

  const handleSearchChange = useCallback((value: string) => {
    setInputValue(value)
    setQuery(value)
  }, [setQuery])

  // ✅ Thêm 2 useCallback còn thiếu cho sort
  const handleSortFieldChange = useCallback(
    (f: SortField) => setSort(f, order),
    [setSort, order]
  );

  const handleSortOrderChange = useCallback(
    (o: SortOrder) => setSort(sort, o),
    [setSort, sort]
  );

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Không thể tải dữ liệu: {(error as Error).message}
        </div>
      )}

      <UserToolbar
        search={inputValue}
        onSearchChange={handleSearchChange}
        filter={status}
        onFilterChange={setStatus}
        sortField={sort}
        onSortFieldChange={handleSortFieldChange}
        sortOrder={order}
        onSortOrderChange={handleSortOrderChange}
        onCreateClick={handleCreateClick}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      <UserTable
        users={users}
        isPending={isPending}
        isFetching={isFetching}
        onEdit={handleEdit}
        onDelete={handleDelete}       
        isDeleting={deleteMutation.isPending}
        search={debouncedQ}
      />

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingUser={editingUser}
        onSubmit={handleDialogSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}