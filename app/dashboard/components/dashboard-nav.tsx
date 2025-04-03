"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Home, Users, Settings } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    adminOnly: true
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FileText,
    adminOnly: false
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: Users,
    adminOnly: false
  },
  {
    title: "Admin",
    href: "/admin",
    icon: Settings,
    adminOnly: true
  }
]

export function DashboardNav() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const userRole = localStorage.getItem("user_role")
    setIsAdmin(userRole === "admin")
  }, [])

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  )

  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-white to-blue-50/50 shadow-xl p-2 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
      <nav className="grid items-start gap-2 py-2 relative">
        {filteredNavItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start h-12 px-4 transition-all duration-200 overflow-hidden group/nav-item",
                pathname === item.href
                  ? "bg-gradient-to-r from-blue-50 to-blue-100/70 text-blue-700 hover:bg-blue-100 hover:text-blue-800 shadow-md relative"
                  : "text-blue-700/70 hover:text-blue-700 hover:bg-blue-50 relative",
              )}
            >
              {pathname === item.href && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/0 via-blue-200/30 to-blue-100/0 opacity-0 group-hover/nav-item:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
              )}
              <item.icon className="mr-3 h-5 w-5 transition-transform duration-300 group-hover/nav-item:scale-110" />
              <span className="relative">{item.title}</span>
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  )
}

