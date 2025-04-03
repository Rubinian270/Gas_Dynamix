"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardShell } from "../../components/dashboard-shell";
import { DashboardHeader } from "../../components/dashboard-header";
import { ArrowLeft, Check, Loader2, Save, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function NewProjectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  const [projectData, setProjectData] = useState({
    name: "",
    description: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!projectData.name.trim()) {
      setSubmitStatus("error");
      setErrorMessage("Project name is required");
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await fetch("https://gaxmixer-production.up.railway.app/user/create-project/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create project");
      }

      // Success
      setSubmitStatus("success");
      
      // Show success toast
      toast({
        title: "Project Created Successfully!",
        description: `Your project "${projectData.name}" has been created.`,
        variant: "default",
        className: "bg-green-50 border-green-200 text-green-800"
      });
      
      // Redirect after short delay
      setTimeout(() => {
        router.push("/dashboard/projects");
      }, 2000);
      
    } catch (error) {
      console.error("Error creating project:", error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to create project");
      
      // Show error toast
      toast({
        title: "Error Creating Project",
        description: error instanceof Error ? error.message : "An error occurred while creating the project.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell>
      <Toaster />
      <Button
        variant="ghost"
        className="mb-4 -ml-4 text-blue-700 hover:text-blue-800 hover:bg-blue-50"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Projects
      </Button>
      
      <DashboardHeader heading="Create New Project" text="Set up a new gas analysis project.">
        <Button 
          className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Create Project
            </>
          )}
        </Button>
      </DashboardHeader>

      {submitStatus === "success" && (
        <Alert className="bg-green-50 border-green-200 text-green-800 shadow-md mb-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-1 rounded-full mr-2">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <AlertDescription className="font-medium text-green-800">
                Project created successfully!
              </AlertDescription>
              <p className="text-sm mt-1 text-green-700">
                Your project "{projectData.name}" has been created. You will be redirected to the projects page.
              </p>
            </div>
          </div>
        </Alert>
      )}

      {submitStatus === "error" && (
        <Alert className="bg-red-50 border-red-200 text-red-800 mb-6">
          <X className="h-4 w-4 text-red-500" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-blue-100 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Enter the basic information about your new gas analysis project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter project name"
                value={projectData.name}
                onChange={handleInputChange}
                className="border-blue-200 focus:border-blue-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter project description"
                value={projectData.description}
                onChange={handleInputChange}
                className="resize-none border-blue-200 focus:border-blue-400 min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Link href="/dashboard/projects">
            <Button variant="outline" type="button" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              Cancel
            </Button>
          </Link>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </div>
      </form>
    </DashboardShell>
  );
} 