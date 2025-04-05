"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "../dashboard/components/dashboard-header"
import { DashboardShell } from "../dashboard/components/dashboard-shell"
import { UserTable } from "./components/user-table"
import { ProjectTable } from "./components/project-table"
import { DataUploadForm } from "./components/data-upload-form"
import { DataFileUpload } from "./components/data-file-upload"
import { Download, RefreshCw, Upload, Users, FolderKanban } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { DeleteActions } from "./components/delete-actions"

export default function AdminPage() {
  return (
    <DashboardShell>
      <Toaster />
      <DashboardHeader heading="Admin Panel" text="Manage projects, users, and upload data.">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {/* <Button className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-blue-300/30 hover:shadow-xl relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 group-hover:animate-shimmer bg-[length:200%_100%]"></span>
            <Download className="mr-2 h-4 w-4 relative" />
            <span className="relative">Export Data</span>
          </Button> */}
        </div>
      </DashboardHeader>
      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="bg-gradient-to-r from-blue-50 to-blue-100/70 p-1 border border-blue-100 rounded-lg shadow-sm">
          <TabsTrigger
            value="projects"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800 flex items-center"
          >
            <FolderKanban className="mr-2 h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800 flex items-center"
          >
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger
            value="data-upload"
            className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800 flex items-center"
          >
            <Upload className="mr-2 h-4 w-4" />
            Data Upload
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <Card className="border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
            <CardHeader className="border-b border-blue-50 pb-4">
              <CardTitle className="text-blue-900 font-semibold">Project Management</CardTitle>
              <CardDescription className="text-blue-700/60">
                View, create and manage all projects in the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <ProjectTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card className="border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
            <CardHeader className="border-b border-blue-50 pb-4">
              <CardTitle className="text-blue-900 font-semibold">User Management</CardTitle>
              <CardDescription className="text-blue-700/60">
                View, create and manage user accounts and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <UserTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Upload Tab */}
        <TabsContent value="data-upload" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Form Upload Option */}
            <Card className="border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
              <CardHeader className="border-b border-blue-50 pb-4">
                <CardTitle className="text-blue-900 font-semibold">Manual Data Entry</CardTitle>
                <CardDescription className="text-blue-700/60">
                  Enter gas analysis data manually using the form.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <DataUploadForm />
              </CardContent>
            </Card>

            {/* File Upload Option */}
            <Card className="border-blue-100 shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm">
              <CardHeader className="border-b border-blue-50 pb-4">
                <CardTitle className="text-blue-900 font-semibold">File Upload</CardTitle>
                <CardDescription className="text-blue-700/60">
                  Upload CSV, Excel or other data files for bulk processing.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <DataFileUpload />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

