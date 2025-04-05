"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FolderPlus, MoreHorizontal, Search, Edit, Trash2, Plus } from "lucide-react"
import { CheckCircle2, Loader2, X } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { format } from "date-fns"

type Project = {
  name: string
  description: string
  project_id: number
  user_id: number
  created_at: string
}

export function ProjectTable() {
  const [projects, setProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionStatus, setActionStatus] = useState<null | "success" | "error" | "loading">(null)
  const [statusMessage, setStatusMessage] = useState("")
  
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    setActionStatus("loading")
    setStatusMessage("Loading projects...")

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication required. Please login again.")
      }

      const response = await fetch("https://gaxmixer-production.up.railway.app/projects/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch projects")
      }

      const data = await response.json()
      setProjects(data)
      setActionStatus(null)
    } catch (error) {
      setActionStatus("error")
      setStatusMessage(error instanceof Error ? error.message : "An error occurred while fetching projects")
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewProject((prev) => ({ ...prev, [name]: value }))
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProject = async () => {
    setIsLoading(true)
    setActionStatus(null)

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication required. Please login again.")
      }

      const response = await fetch("https://gaxmixer-production.up.railway.app/projects/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newProject),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to create project")
      }

      // Refresh projects list
      await fetchProjects()
      
      setActionStatus("success")
      setStatusMessage("Project successfully created")
      
      // Reset form
      setTimeout(() => {
        setNewProject({
          name: "",
          description: "",
        })
        setIsAddProjectOpen(false)
        setActionStatus(null)
      }, 2000)
    } catch (error) {
      setActionStatus("error")
      setStatusMessage(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication required. Please login again.")
      }

      const deleteResponse = await fetch(`https://gaxmixer-production.up.railway.app/admin/projects/${projectId}/`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        mode: 'cors'
      })

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json()
        throw new Error(errorData.detail || "Failed to delete project")
      }

      // Update local state
      setProjects(projects.filter((project) => project.project_id !== projectId))
      
      setActionStatus("success")
      setStatusMessage("Project successfully deleted")
      setTimeout(() => setActionStatus(null), 3000)
    } catch (error) {
      console.error('Error deleting project:', error)
      setActionStatus("error")
      setStatusMessage(error instanceof Error ? error.message : "An error occurred while deleting the project")
      setTimeout(() => setActionStatus(null), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {actionStatus && (
        <Alert 
          className={
            actionStatus === "success" 
              ? "bg-green-50 border-green-200 text-green-800" 
              : actionStatus === "error"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }
        >
          {actionStatus === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
          {actionStatus === "error" && <X className="h-4 w-4 text-red-500" />}
          {actionStatus === "loading" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
          <AlertDescription>{statusMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 border-blue-200 w-full"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={fetchProjects}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <Loader2 className={`mr-2 h-4 w-4 ${actionStatus === "loading" ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
            <DialogTrigger asChild>
              {/* <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200">
                <FolderPlus className="mr-2 h-4 w-4" />
                Add Project
              </Button> */}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newProject.name}
                    onChange={handleInputChange}
                    placeholder="Enter project name"
                    className="border-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newProject.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description"
                    className="resize-none h-24 border-blue-200"
                  />
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button 
                  type="button" 
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => setIsAddProjectOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddProject}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Project
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border border-blue-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-50/90">
            <TableRow className="hover:bg-blue-100/50">
              <TableHead className="font-semibold text-blue-900">Project Name</TableHead>
              <TableHead className="font-semibold text-blue-900 hidden md:table-cell">Description</TableHead>
              <TableHead className="font-semibold text-blue-900">Created</TableHead>
              <TableHead className="font-semibold text-blue-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionStatus === "loading" ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                    <span>Loading projects...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project.project_id} className="hover:bg-blue-50/50">
                  <TableCell className="font-medium text-blue-900">
                    {project.name}
                  </TableCell>
                  <TableCell className="text-blue-700 hidden md:table-cell max-w-xs truncate">
                    {project.description}
                  </TableCell>
                  <TableCell className="text-blue-700">
                    {formatDate(project.created_at)}
                  </TableCell>
                  <TableCell className="text-right space-x-2 whitespace-nowrap">
                    {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-700">
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-700"
                      onClick={() => handleDeleteProject(project.project_id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <AlertCircle className="h-6 w-6 text-blue-400" />
                    <div>
                      <p className="text-blue-700">No projects found</p>
                      <p className="text-blue-600/70 text-sm">Create a new project to get started</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

