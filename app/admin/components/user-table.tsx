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
import { MoreHorizontal, Search, UserPlus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Edit, Loader2, Plus, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import { Check } from "lucide-react"

type User = {
  username: string
  email: string
  role: string
  id: number
  lastActive: string
  status: string
}

type ActionStatus = {
  type: 'success' | 'error' | 'loading'
  message: string
}

export function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionStatus, setActionStatus] = useState<ActionStatus | null>(null)
  const [statusMessage, setStatusMessage] = useState("")
  
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "normal",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setActionStatus({
      type: "loading",
      message: "Loading users..."
    });

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication required. Please login again.")
      }

      const response = await fetch("https://gaxmixer-production.up.railway.app/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
      setActionStatus(null)
    } catch (error) {
      setActionStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred while fetching users"
      });
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setNewUser((prev) => ({ ...prev, role: value }))
  }

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = async () => {
    // Validate form
    if (!newUser.username || !newUser.email || !newUser.password) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive",
      })
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setActionStatus(null)

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        setActionStatus({
          type: "error",
          message: "Authentication required. Please login again.",
        })
        
        toast({
          title: "Authentication Error",
          description: "Authentication required. Please login again.",
          variant: "destructive",
        })
        
        return
      }

      const response = await fetch("https://gaxmixer-production.up.railway.app/admin/create-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          role: newUser.role,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to add user")
      }

      fetchUsers()
      setIsAddUserModalOpen(false)
      setNewUser({
        username: "",
        email: "",
        password: "",
        role: "normal",
      })
      
      // Enhanced success toast notification
      toast({
        title: "User Created Successfully!",
        description: `${newUser.username} has been added with ${newUser.role} permissions.`,
        variant: "default",
        className: "bg-green-50 border border-green-200 text-green-800",
      })
    } catch (error) {
      console.error("Error adding user:", error)
      setActionStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      })

      // Enhanced error toast notification
      toast({
        title: "Error Creating User",
        description: error instanceof Error ? error.message : "An error occurred while adding the user.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("Authentication required. Please login again.")
      }

      const response = await fetch(`https://gaxmixer-production.up.railway.app/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to delete user")
      }

      // Update local state
      setUsers(users.filter((user) => user.id !== userId))
      
      setActionStatus({
        type: "success",
        message: "User successfully deleted"
      });
      
      // Show toast notification
      toast({
        title: "User Deleted",
        description: "The user has been successfully removed from the system.",
        variant: "default",
        className: "bg-green-50 border border-green-200 text-green-800",
      });
      
      setTimeout(() => setActionStatus(null), 3000)
    } catch (error) {
      setActionStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred"
      });
      
      // Show error toast notification
      toast({
        title: "Error Deleting User",
        description: error instanceof Error ? error.message : "An error occurred while deleting the user.",
        variant: "destructive",
      });
      
      setTimeout(() => setActionStatus(null), 3000)
    }
  }

  // Helper function to get role display text and style
  const getRoleInfo = (role: string) => {
    const normalizedRole = role.toLowerCase()
    if (normalizedRole === "admin") {
      return {
        display: "Admin",
        style: "bg-purple-50 text-purple-700 border-purple-200"
      }
    } else if (normalizedRole === "normal") {
      return {
        display: "User",
        style: "bg-blue-50 text-blue-700 border-blue-200"
      }
    } else {
      return {
        display: role,
        style: "bg-slate-50 text-slate-700 border-slate-200"
      }
    }
  }

  return (
    <div className="space-y-4">
      <Toaster />
      {actionStatus && (
        <Alert 
          variant={actionStatus.type === "error" ? "destructive" : "default"}
          className={actionStatus.type === "success" ? "bg-green-50 border-green-200 text-green-800" : ""}
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{actionStatus.message}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search users..."
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
            onClick={fetchUsers}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          >
            <Loader2 className={`mr-2 h-4 w-4 ${actionStatus?.type === "loading" ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Dialog open={isAddUserModalOpen} onOpenChange={setIsAddUserModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={newUser.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    className="border-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="border-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="border-blue-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger className="border-blue-200">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="normal">Normal User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="sm:justify-start">
                <Button 
                  type="button" 
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => setIsAddUserModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleAddUser}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create User
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
              <TableHead className="font-semibold text-blue-900">Username</TableHead>
              <TableHead className="font-semibold text-blue-900">Email</TableHead>
              <TableHead className="font-semibold text-blue-900">Role</TableHead>
              <TableHead className="font-semibold text-blue-900 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {actionStatus?.type === "loading" ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const roleInfo = getRoleInfo(user.role)
                return (
                  <TableRow key={user.id} className="hover:bg-blue-50/50">
                    <TableCell className="font-medium text-blue-900">{user.username}</TableCell>
                    <TableCell className="text-blue-700">{user.email}</TableCell>
                <TableCell>
                      <Badge
                        variant="outline"
                        className={roleInfo.style}
                      >
                        {roleInfo.display}
                      </Badge>
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
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <AlertCircle className="h-6 w-6 text-blue-400" />
                    <div>
                      <p className="text-blue-700">No users found</p>
                      <p className="text-blue-600/70 text-sm">Create a new user to get started</p>
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

