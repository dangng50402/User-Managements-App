'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { userApi } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { FilterStatus, SortField, SortOrder } from '@/types/user'

interface UseUsersOptions {
  search: string          // debounced search query
  filter: FilterStatus
  sortField: SortField
  sortOrder: SortOrder
}

export function useUsers({
  search,
  filter,
  sortField,
  sortOrder,
}: UseUsersOptions) {
  // useQuery: fetch + cache
  const {
    data: allUsers = [],
    isPending,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.users.all(),
    queryFn: userApi.getAll,
    staleTime: 60_000,
  })

  // useMemo: filter + search + sort
  // Chỉ tính lại khi allUsers, search, filter, hoặc sort thay đổi
  const filteredUsers = useMemo(() => {
    let result = [...allUsers]

    // 1. Filter
    if (filter === 'has-website') {
      result = result.filter(u => u.website && u.website.trim() !== '')
    } else if (filter === 'no-website') {
      result = result.filter(u => !u.website || u.website.trim() === '')
    }

    // 2. Search (case-insensitive)
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter(
        u =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          u.company.name.toLowerCase().includes(q)
      )
    }

    // 3. Sort
    result.sort((a, b) => {
      let valA: string
      let valB: string

      if (sortField === 'company') {
        valA = a.company.name.toLowerCase()
        valB = b.company.name.toLowerCase()
      } else {
        valA = a[sortField].toLowerCase()
        valB = b[sortField].toLowerCase()
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [allUsers, search, filter, sortField, sortOrder])

  return {
    users: filteredUsers,
    totalCount: allUsers.length,
    filteredCount: filteredUsers.length,
    isPending,
    isError,
    error,
    isFetching,
  }
}