"use client"

import { useState } from "react"
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
import type { User, UpdateUserInput, CreateUserInput } from "@/types/user"
import type { UserFormValues } from "@/lib/schemas"

export function UsersPageClient() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const router = useRouter()

  const { query, status, sort, order, setQuery, setStatus, setSort } =
    useTableQueryState()

  // inputValue: UI state thuần — không dùng useEffect để sync
  // Khởi tạo từ query (URL) để không mất state khi refresh
  const [inputValue, setInputValue] = useState(query)

  // debouncedQ: chỉ dùng để gọi API — không update URL
  // URL được update bởi setQuery khi user dừng gõ
  const debouncedQ = useDebounce(inputValue, 400)

  const [dialogOpen,  setDialogOpen]  = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const {
    users, totalCount, filteredCount,
    isPending, isError, error, isFetching,
  } = useUsers({
    search:    debouncedQ,  // ← dùng debouncedQ trực tiếp, không qua URL
    filter:    status,
    sortField: sort,
    sortOrder: order,
  })

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để thực hiện thao tác này")
      router.replace("/login")
      return
    }
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDialogSubmit = (values: UserFormValues) => {
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
  }

  // Handler cho search input — update cả inputValue lẫn URL
  const handleSearchChange = (value: string) => {
    setInputValue(value)   // update UI ngay
    setQuery(value)        // update URL (hook dùng router.replace)
  }

  return (
    <div className="space-y-6">
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Không thể tải dữ liệu: {(error as Error).message}
        </div>
      )}

      <UserToolbar
        search={inputValue}
        onSearchChange={handleSearchChange}  // ← gọi cả 2: setInputValue + setQuery
        filter={status}
        onFilterChange={setStatus}
        sortField={sort}
        onSortFieldChange={(f) => setSort(f, order)}
        sortOrder={order}
        onSortOrderChange={(o) => setSort(sort, o)}
        onCreateClick={handleCreateClick}
        totalCount={totalCount}
        filteredCount={filteredCount}
      />

      <UserTable
        users={users}
        isPending={isPending}
        isFetching={isFetching}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        isDeleting={deleteMutation.isPending}
        search={debouncedQ}  // ← debouncedQ cho highlight
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