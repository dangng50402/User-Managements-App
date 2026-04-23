import { create } from "zustand";
import { persist } from "zustand/middleware";

//State interface
interface AuthState {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;

  //Actions
  login: (name: string, email: string) => void;
  logout: () => void;
}

//cteate() với persist middleware
//persist: lưu state vào localStorage -> refresh trang không bị logout
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false, //state

      login: (name, email) =>
        set({ user: { name, email }, isAuthenticated: true }),

      logout: () => set({ user: null, isAuthenticated: false }), //actions
    }),
    {
      name: "auth-storage", //localStorage key
      // Chỉ persist field cần thiết (không persist toàn bộ)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
// Selector functions — dùng thay vì truy cập store trực tiếp
// Lý do: selector chỉ re-render khi giá trị đó thay đổi
// (thay vì re-render khi bất kỳ field nào trong store thay đổi)
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectAuthUser = (state: AuthState) => state.user