"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export function DeleteActions({ selectedUserId }: { selectedUserId?: string }) {
  const [userId, setUserId] = useState(selectedUserId || "");
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState({ user: false, project: false });
  const [error, setError] = useState({ user: "", project: "" });
  const { toast } = useToast();

  useEffect(() => {
    if (selectedUserId) {
      setUserId(selectedUserId);
    }
  }, [selectedUserId]);

  const handleDeleteUser = async () => {
    if (!userId) {
      setError({ ...error, user: "User ID is required" });
      return;
    }

    setLoading({ ...loading, user: true });
    setError({ ...error, user: "" });

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/admin/users/${encodeURIComponent(userId)}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      toast({
        title: "Success",
        description: `User with ID ${userId} has been deleted successfully.`,
      });
      setUserId("");
    } catch (err) {
      setError({ ...error, user: "Failed to delete user. Please try again." });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user. Please try again.",
      });
    } finally {
      setLoading({ ...loading, user: false });
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) {
      setError({ ...error, project: "Project ID is required" });
      return;
    }

    setLoading({ ...loading, project: true });
    setError({ ...error, project: "" });

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `https://gaxmixer-production.up.railway.app/admin/projects/${encodeURIComponent(projectId)}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      toast({
        title: "Success",
        description: `Project with ID ${projectId} has been deleted successfully.`,
      });
      setProjectId("");
    } catch (err) {
      setError({ ...error, project: "Failed to delete project. Please try again." });
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete project. Please try again.",
      });
    } finally {
      setLoading({ ...loading, project: false });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Delete User</CardTitle>
          <CardDescription>
            Remove a user from the system. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              type="number"
            />
            {error.user && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.user}</AlertDescription>
              </Alert>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading.user}>
                <Trash2 className="mr-2 h-4 w-4" />
                {loading.user ? "Deleting..." : "Delete User"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the user
                  account and remove their data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delete Project</CardTitle>
          <CardDescription>
            Remove a project from the system. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Enter project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              type="number"
            />
            {error.project && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.project}</AlertDescription>
              </Alert>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={loading.project}>
                <Trash2 className="mr-2 h-4 w-4" />
                {loading.project ? "Deleting..." : "Delete Project"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the project
                  and all associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}