'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { User } from '@/types/user'

interface UpdateUserPayload {
  id: number
  data: Partial<User>
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: UpdateUserPayload) =>
      userApi.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all() })

      const previousUsers = queryClient.getQueryData<User[]>(queryKeys.users.all())

      // Optimistic: cập nhật user trong list ngay lập tức
      queryClient.setQueryData<User[]>(queryKeys.users.all(), (old) =>
        old?.map((u) => (u.id === id ? { ...u, ...data } : u)) ?? []
      )

      // Cache detail query nếu đang mở
      const previousUser = queryClient.getQueryData<User>(queryKeys.users.detail(id))
      queryClient.setQueryData<User>(queryKeys.users.detail(id), (old) =>
        old ? { ...old, ...data } : old
      )

      return { previousUsers, previousUser }
    },

    onError: (_err, { id }, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKeys.users.all(), context.previousUsers)
      }
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.users.detail(id), context.previousUser)
      }
      toast.error('Cập nhật thất bại')
    },

    onSuccess: () => {
      toast.success('Đã lưu thay đổi')
    },

    onSettled: (_data, _err, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) })
    },
  })
}