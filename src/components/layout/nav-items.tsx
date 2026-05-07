import {
    LayoutDashboard,
    Users,
    Settings,
    type LucideIcon,
  } from "lucide-react"
  
  export type NavItem = {
    label: string
    href: string
    icon: LucideIcon
  }
  
  export const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/users",
      icon: LayoutDashboard,
    },
    {
      label: "Users",
      href: "/users",
      icon: Users,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]