'use client'

import { LogOut, User } from 'lucide-react'
import { useAuthStore, selectAuthUser, selectIsAuthenticated } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const user = useAuthStore(selectAuthUser)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-lg">User Management</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            JSONPlaceholder API
          </p>
        </div>

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm hidden sm:inline">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" size="sm" asChild>
            <a href="/login">
              <User className="mr-2 h-4 w-4" />
              Đăng nhập
            </a>
          </Button>
        )}
      </div>
    </header>
  )
}