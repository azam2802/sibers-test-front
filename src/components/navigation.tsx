"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { user, signOut, isSignedIn } = useAuthStore()

  // Don't show navigation on login page
  if (pathname === "/login" || !isSignedIn) {
    return null
  }

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["Director", "ProjectManager", "Employee"],
    },
    {
      href: "/projects",
      label: "Projects",
      icon: FolderKanban,
      roles: ["Director", "ProjectManager", "Employee"],
    },
    {
      href: "/tasks",
      label: "Tasks",
      icon: CheckSquare,
      roles: ["Director", "ProjectManager", "Employee"],
    },
    {
      href: "/employees",
      label: "Employees",
      icon: User,
      roles: ["Director"],
    },
  ]

  const visibleItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              Sibers Test
            </Link>
            <div className="flex items-center gap-1">
              {visibleItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.firstName} {user?.lastName} ({user?.role})
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

