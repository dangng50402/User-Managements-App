import { Header } from "./header"
import { SidebarContent } from "./sidebar"

type DashboardLayoutProps = {
  children: React.ReactNode
  title: string
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    // h-screen + overflow-hidden: toàn bộ viewport, không scroll body
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar:
          - mobile (<md): ẩn
          - tablet (md): hiện, w-14 (56px) → collapsed
          - desktop (lg): hiện, w-60 (240px) → expanded
          "group" để children dùng group-[...] selector
      */}
      <aside
        className="hidden md:flex md:w-14 lg:w-60 flex-col flex-shrink-0 border-r transition-all duration-200"
        aria-label="Main navigation"
      >
        <SidebarContent />
      </aside>
      
      {/* Main area: Header + Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />

        {/* Content area — chỉ vùng này scroll */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}