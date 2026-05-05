"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet"
import { SidebarContent } from "./sidebar"

type HeaderProps = {
  title: string
}

export function Header({ title }: HeaderProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <header className="flex h-14 items-center border-b bg-background px-4 gap-4">
      {/* Hamburger — chỉ hiện trên mobile (< lg) */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSheetOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <SheetContent side="left" className="p-0 w-60">
          {/* SheetTitle required cho accessibility (screen reader) */}
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent onClose={() => setSheetOpen(false)} isSheet={true} />
        </SheetContent>
      </Sheet>

      {/* Page title */}
      <h1 className="text-sm font-semibold flex-1">{title}</h1>

      {/* User menu — phải header */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-2 h-9 px-2"
            aria-label="User account menu"
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src="" alt="User avatar" />
              <AvatarFallback className="text-xs">JD</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:inline">
              John Doe
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-neutral-900">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}