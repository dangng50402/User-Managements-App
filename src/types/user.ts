// Kiểu dữ liệu trả về từ JSONPlaceholder /users
export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

/// ── Utility types — không viết lại thủ công ───────────────────────────────

// Tạo user mới: bỏ id (server tự sinh), dùng Omit
// Dùng Omit vì ta loại bỏ ít field hơn số field giữ lại
// export type CreateUserPayload = Omit<User, 'id'> 

// Payload gửi lên khi create — các field không bắt buộc đặt optional
// Dùng Pick<User,'id'> & Partial<...> vì id là required, phần còn lại optional
export type UpdateUserInput = Pick<User, 'id'> & Partial<Omit<User, 'id'>>

// Chỉ những field cần thiết cho form create — username/email bắt buộc
// phone/website optional nên dùng Partial cho phần đó
export type CreateUserInput = Pick<User, 'name' | 'username' | 'email'> & {
  phone?: string
  website?: string
  address?: Partial<User['address']>
  company?: Partial<User['company']>
}

// Hiển thị trên table — chỉ cần những field này, dùng Pick
// Dùng Pick vì ta chọn ít field hơn số field bỏ đi
export type UserListItem = Pick<User, 'id' | 'name' | 'email' | 'phone' | 'website'> & {
  // address.city và company.name cần cho table nhưng không phải top-level field
  // nên extend thêm thay vì Pick nested (TS không hỗ trợ Pick nested trực tiếp)
  address: Pick<User['address'], 'city'>
  company: Pick<User['company'], 'name'>
}

// Kiểu dữ liệu để filter/sort
export type SortField = "name" | "email" | "company";
export type SortOrder = "asc" | "desc";
export type FilterStatus = "all" | "has-website" | "no-website";
