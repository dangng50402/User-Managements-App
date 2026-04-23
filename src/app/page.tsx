'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useAuthStore, selectIsAuthenticated } from '@/stores/auth-store'
import { useUsers } from '@/hooks/use-users'
import { useCreateUser } from '@/hooks/use-create-user'
import { useUpdateUser } from '@/hooks/use-update-user'
import { useDeleteUser } from '@/hooks/use-delete-user'
import { useDebounce } from '@/hooks/use-debounce'
import { Header } from '@/components/layout/header'
import { UserToolbar } from '@/components/users/user-toolbar'
import { UserTable } from '@/components/users/user-table'
import { UserDialog } from '@/components/users/user-dialog'
import type { User, FilterStatus, SortField, SortOrder } from '@/types/user'
import type { UserFormValues } from '@/lib/schemas'

export default function HomePage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const router = useRouter()

  // ── Filter / Search / Sort state ──────────────────────────────────────────
  const [searchInput, setSearchInput] = useState('')
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  // Debounce: input thay đổi ngay, query chỉ cập nhật sau 300ms
  const search = useDebounce(searchInput, 300)

  // ── Dialog state ──────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // ── Data hooks ────────────────────────────────────────────────────────────
  const { users, totalCount, filteredCount, isPending, isError, error, isFetching } =
    useUsers({ search, filter, sortField, sortOrder })

  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreateClick = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thực hiện thao tác này')
      router.push('/login')
      return
    }
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id)
  }

  const handleDialogSubmit = (values: UserFormValues) => {
    if (editingUser) {
      // Edit mode
      updateMutation.mutate(
        {
          id: editingUser.id,
          data: {
            name: values.name,
            username: values.username ?? '',
            email: values.email,
            phone: values.phone ?? '',
            website: values.website ?? '',
            address: { ...editingUser.address, city: values.city ?? '' },
            company: { ...editingUser.company, name: values.company ?? '' },
          },
        },
        {
          onSuccess: () => setDialogOpen(false),
        }
      )
    } else {
      // Create mode
      createMutation.mutate(
        {
          name: values.name,
          username: values.username ?? '',
          email: values.email,
          phone: values.phone,
          website: values.website,
        },
        {
          onSuccess: () => setDialogOpen(false),
        }
      )
    }
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Error state */}
        {isError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Không thể tải dữ liệu: {(error as Error).message}
          </div>
        )}

        {/* Toolbar */}
        <UserToolbar
          search={searchInput}
          onSearchChange={(v) => { setSearchInput(v) }}
          filter={filter}
          onFilterChange={setFilter}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onCreateClick={handleCreateClick}
          totalCount={totalCount}
          filteredCount={filteredCount}
        />

        {/* Table */}
        <UserTable
          users={users}
          isPending={isPending}
          isFetching={isFetching}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
          search={search}
        />
      </main>

      {/* Create / Edit Dialog */}
      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingUser={editingUser}
        onSubmit={handleDialogSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}