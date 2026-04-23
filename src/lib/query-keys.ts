// Tập trung query keys — tránh typo, dễ invalidate
// Pattern: factory functions trả về readonly array
export const queryKeys = {
    users: {
      all: () => ['users'] as const,
      detail: (id: number) => ['users', id] as const,
    },
  }