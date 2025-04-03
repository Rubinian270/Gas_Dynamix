import type React from "react"
import { DashboardNav } from "./dashboard-nav"
import { UserNav } from "./user-nav"
import { FlaskRoundIcon as Flask } from "lucide-react"
import Link from "next/link"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50/30 via-white to-blue-50/30">
      <header className="sticky top-0 z-40 border-b border-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-md transition-all duration-300">
        <div className="container flex h-20 items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-700 group">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg shadow-md group-hover:shadow-lg group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-300 group-hover:scale-105">
              <Flask className="h-6 w-6" />
            </div>
            <span className="tracking-tight group-hover:text-blue-800 transition-colors duration-300">
              GasAnalytics
            </span>
          </Link>
          <UserNav />
        </div>
      </header>
      <div className="container grid flex-1 gap-12 md:grid-cols-[240px_1fr] py-8">
        <aside className="hidden w-[240px] flex-col md:flex">
          <div className="sticky top-24">
            <DashboardNav />
          </div>
        </aside>
        <main className="flex w-full flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}

