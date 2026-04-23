import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    // Cleanup: xóa timer nếu value thay đổi trước khi delay hết
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}