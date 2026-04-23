'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { User } from '@/types/user'

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userApi.delete(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all() })

      const previousUsers = queryClient.getQueryData<User[]>(queryKeys.users.all())

      // Optimistic delete: xóa khỏi list ngay
      queryClient.setQueryData<User[]>(queryKeys.users.all(), (old) =>
        old?.filter((u) => u.id !== id) ?? []
      )

      return { previousUsers }
    },

    onError: (_err, _id, context) => {
      // Rollback
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKeys.users.all(), context.previousUsers)
      }
      toast.error('Xóa thất bại, đã hoàn tác')
    },

    onSuccess: () => {
      toast.success('Đã xóa user')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}