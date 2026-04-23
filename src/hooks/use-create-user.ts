'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { CreateUserPayload, User } from '@/types/user'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userApi.create(payload),

    // onMutate: optimistic update
    onMutate: async (payload) => {
      // 1. Cancel pending queries để tránh race condition
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all() })

      // 2. Snapshot để rollback
      const previousUsers = queryClient.getQueryData<User[]>(queryKeys.users.all())

      // 3. Thêm placeholder với ID âm (KHÔNG dùng Math.random())
      queryClient.setQueryData<User[]>(queryKeys.users.all(), (old) => [
        {
          id: Date.now() * -1,
          name: `⏳ ${payload.name}`,
          username: payload.username ?? '',
          email: payload.email,
          phone: payload.phone ?? '',
          website: payload.website ?? '',
          address: { street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' } },
          company: { name: payload.company?.name ?? '', catchPhrase: '', bs: '' },
        } satisfies User,
        ...(old ?? []),
      ])

      return { previousUsers }
    },

    onError: (_err, _payload, context) => {
      // Rollback về snapshot
      if (context?.previousUsers) {
        queryClient.setQueryData(queryKeys.users.all(), context.previousUsers)
      }
    },

    onSuccess: () => {
      toast.success('Tạo user thành công')
    },

    // onSettled luôn chạy → sync với server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all() })
    },
  })
}