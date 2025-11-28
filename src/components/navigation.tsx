"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, User, Menu, X } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { user, signOut, isSignedIn } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="text-xl font-bold min-w-fit">
              Sibers Test
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
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

          {/* Desktop User Info & Sign Out */}
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-muted-foreground text-right">
              {user?.firstName} {user?.lastName} ({user?.role})
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen
              ? "max-h-96 opacity-100"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="pb-4 space-y-2">
            {/* Mobile Navigation Links */}
            {visibleItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
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

            {/* Mobile User Info */}
            <div className="px-4 py-2 text-sm text-muted-foreground border-t mt-2 pt-4">
              <div className="mb-2">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="mb-3 text-xs">Role: {user?.role}</div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  signOut()
                  closeMobileMenu()
                }}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
