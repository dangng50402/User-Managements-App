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

// Kiểu dữ liệu để tạo user mới (gửi lên server)
export type CreateUserPayload = Pick<
  User,
  "name" | "username" | "email" 
> & {
  phone?: string
  website?: string
  address?: Partial<User["address"]>;
  company?: Partial<User["company"]>;
};

// Kiểu dữ liệu để filter/sort
export type SortField = "name" | "email" | "company";
export type SortOrder = "asc" | "desc";
export type FilterStatus = "all" | "has-website" | "no-website";
