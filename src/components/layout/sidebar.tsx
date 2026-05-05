// src/components/layout/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { navItems } from "./nav-items"

type SidebarContentProps = {
  onClose?: () => void
  isSheet?: boolean
}

export function SidebarContent({ onClose, isSheet = false }: SidebarContentProps) {
  const pathname = usePathname()

  // Label hiện khi: desktop (lg) HOẶC trong Sheet
  const showLabel = isSheet ? "block" : "hidden lg:block"

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-3">
        <Link
          href="/users"
          className="flex items-center gap-2 font-semibold"
          onClick={onClose}
        >
          <div className="h-6 w-6 rounded-md bg-primary flex-shrink-0" />
          <span className={cn("text-sm truncate", showLabel)}>
            User Management
          </span>
        </Link>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          <p className={cn(
            "px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider",
            showLabel
          )}>
            Main
          </p>

          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                  isSheet ? "justify-start" : "justify-center lg:justify-start",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className={showLabel}>{item.label}</span>
              </Link>
            )
          })}

          <Separator className="my-2" />

          <p className={cn(
            "px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider",
            showLabel
          )}>
            System
          </p>

          {navItems.slice(2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                  isSheet ? "justify-start" : "justify-center lg:justify-start",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className={showLabel}>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <p className={cn("text-xs text-muted-foreground", showLabel)}>
          v1.0.0
        </p>
      </div>
    </div>
  )
}