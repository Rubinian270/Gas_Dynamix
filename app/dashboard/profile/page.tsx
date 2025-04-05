import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardHeader } from "../components/dashboard-header"
import { DashboardShell } from "../components/dashboard-shell"
import { ProfileInfo } from "./components/profile-info"
import { ProfileActivity } from "./components/profile-activity"
import { ProfileStats } from "./components/profile-stats"
import { Pencil } from "lucide-react"

export default function ProfilePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="My Profile" text="View and manage your profile information.">
        <Button className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-blue-300/30 hover:shadow-xl relative overflow-hidden group">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></span>
          <Pencil className="mr-2 h-4 w-4 relative" />
          <span className="relative">Edit Profile</span>
        </Button>
      </DashboardHeader>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-3 border-blue-100 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
          <CardHeader className="pb-2 border-b border-blue-50">
            <CardTitle className="text-blue-900 font-semibold">Profile Information</CardTitle>
            <CardDescription className="text-blue-700/60">Your personal and contact information</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ProfileInfo />
          </CardContent>
        </Card>

        <Card className="col-span-7 md:col-span-4 border-blue-100 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
          <CardHeader className="pb-2 border-b border-blue-50">
            <CardTitle className="text-blue-900 font-semibold">Profile Statistics</CardTitle>
            <CardDescription className="text-blue-700/60">Your activity and performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ProfileStats />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-blue-100 shadow-xl hover:shadow-2xl transition-shadow bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
        <CardHeader className="pb-2 border-b border-blue-50">
          <CardTitle className="text-blue-900 font-semibold">Recent Activity</CardTitle>
          <CardDescription className="text-blue-700/60">Your recent actions and contributions</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ProfileActivity />
        </CardContent>
      </Card>
    </DashboardShell>
  )
}

