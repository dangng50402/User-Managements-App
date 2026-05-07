"use client"

import { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { FilterStatus, SortField, SortOrder } from "@/types/user"

const VALID_STATUS = ["all", "has-website", "no-website"] as const
const VALID_SORT   = ["name", "email", "company"] as const
const VALID_ORDER  = ["asc", "desc"] as const

const DEFAULTS = {
  status: "all"  as FilterStatus,
  sort:   "name" as SortField,
  order:  "asc"  as SortOrder,
  page:   1,
} as const

function parseEnum<T extends string>(
  value: string | null,
  valid: readonly T[],
  fallback: T
): T {
  if (!value) return fallback
  return (valid as readonly string[]).includes(value)
    ? (value as T)
    : fallback
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : fallback
}

export function useTableQueryState() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  // Đọc và parse từ URL — đây là source of truth duy nhất
  const query  = searchParams.get("q") ?? ""
  const status = parseEnum(searchParams.get("status"), VALID_STATUS, DEFAULTS.status)
  const sort   = parseEnum(searchParams.get("sort"),   VALID_SORT,   DEFAULTS.sort)
  const order  = parseEnum(searchParams.get("order"),  VALID_ORDER,  DEFAULTS.order)
  const page   = parsePositiveInt(searchParams.get("page"), DEFAULTS.page)

  const buildParams = useCallback(
    (overrides: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(overrides)) {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      }
      return params
    },
    [searchParams]
  )

  const navigate = useCallback(
    (params: URLSearchParams) => {
      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname]
  )

  // Setters — không có useEffect nào cả
  const setQuery = useCallback((value: string) => {
    navigate(buildParams({
      q:    value || null,
      page: "1",
    }))
  }, [buildParams, navigate])

  const setStatus = useCallback((value: FilterStatus) => {
    navigate(buildParams({
      status: value === DEFAULTS.status ? null : value,
      page:   "1",
    }))
  }, [buildParams, navigate])

  const setSort = useCallback((field: SortField, newOrder: SortOrder) => {
    navigate(buildParams({
      sort:  field    === DEFAULTS.sort  ? null : field,
      order: newOrder === DEFAULTS.order ? null : newOrder,
      page:  "1",
    }))
  }, [buildParams, navigate])

  const setPage = useCallback((newPage: number) => {
    const params = buildParams({
      page: newPage === 1 ? null : String(newPage)
    })
    router.replace(`${pathname}?${params.toString()}`)
  }, [buildParams, router, pathname])

  return { query, status, sort, order, page, setQuery, setStatus, setSort, setPage }
}