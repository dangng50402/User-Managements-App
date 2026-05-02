## Những thay đổi trong PR

### Phần A — Tách reusable components

Tách 2 component từ code inline lặp lại:
- `ConfirmDialog` (`src/components/ui/confirm-dialog.tsx`) — bọc AlertDialog, 
  support loading state và variant destructive
- `EmptyState` (`src/components/ui/empty-state.tsx`) — hiển thị trạng thái rỗng 
  với icon, title, description và action tùy chọn

Thay thế trong `user-table.tsx`: xóa AlertDialog inline (17 dòng) và 
empty state inline (5 dòng), thay bằng 2 component trên.

### Phần B — Utility types

Refactor `types/user.ts`: thay type viết tay bằng utility types:
- `CreateUserInput` — `Pick` + intersection type thay vì viết lại từng field
- `UpdateUserInput` — `Pick<User, 'id'> & Partial<Omit<User, 'id'>>` 
  thay vì object literal
- `UserListItem` — `Pick` các field cần thiết cho table

---

### Khi nào tôi chọn tách component?

Tôi chọn tách khi đủ 3 điều kiện: lặp ≥ 2 lần, scope rõ ràng (UI 
thuần, không trộn business logic), props ổn định (không thay đổi mỗi 
lần dùng).

**Ví dụ KHÔNG tách trong codebase:** `HighlightText` trong `user-table.tsx`. 
Lý do: component này chỉ dùng đúng 1 nơi, gắn chặt với logic highlight 
của search trong table, nếu tách ra thành file riêng thì khi đọc 
user-table phải nhảy sang file khác để hiểu. Giữ inline hợp lý hơn 
vì scope rõ ràng và không có dấu hiệu tái sử dụng.

### `Pick<T, K>` vs `Omit<T, K>` — khi nào dùng cái nào?

Rule of thumb: **đếm số field**, dùng cái nào đọc ngắn hơn.

- `Pick` khi giữ lại ÍT field hơn số field bỏ đi — ví dụ `UserListItem` 
  chỉ cần 4/10 field → `Pick<User, 'id' | 'name' | 'email' | 'phone'>` 
  rõ hơn là liệt kê 6 field cần Omit.
- `Omit` khi bỏ đi ÍT field hơn số field giữ lại — ví dụ `CreateUserPayload` 
  chỉ bỏ `id` → `Omit<User, 'id'>` rõ hơn là Pick 9 field còn lại.

Ngoài ra, `Omit` an toàn hơn khi `User` thêm field mới: type tự mở 
rộng. `Pick` thì không — phải cập nhật thủ công nếu muốn thêm field mới 
vào derived type.