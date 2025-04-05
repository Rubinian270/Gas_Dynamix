"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "../components/dashboard-header";
import { DashboardShell } from "../components/dashboard-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Filter, FolderPlus, Search, SlidersHorizontal, Loader2, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Project = {
  project_id: number;
  name: string;
  description: string;
  created_at: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        throw new Error('Authentication required. Please login again.');
      }

      const response = await fetch('https://gaxmixer-production.up.railway.app/projects/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Projects"
        text="Create and manage your gas analysis projects."
      >
        <Button
          className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg"
          onClick={() => router.push('/dashboard/projects/new')}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DashboardHeader>

      {error ? (
        <Alert className="mb-6 bg-red-50 border-red-200 text-red-800">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : loading ? (
        <div className="flex justify-center items-center py-40">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mr-2" />
          <span className="text-blue-700 text-lg">Loading projects...</span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-blue-100"
              />
            </div>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-6" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gradient-to-r from-blue-50 to-blue-100/70 p-1 border border-blue-100 rounded-lg shadow-sm">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800"
              >
                All Projects
              </TabsTrigger>
              <TabsTrigger
                value="recent"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800"
              >
                Recent
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-md data-[state=active]:border-blue-100 rounded-md transition-all hover:bg-blue-50/80 hover:text-blue-800"
              >
                Archived
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.map((project) => (
                  <div key={project.project_id} className="flex flex-col items-start gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start w-full"
                      onClick={() => {
                        localStorage.setItem('selectedProjectId', project.project_id.toString());
                        router.push(`/dashboard/projects/${project.project_id}`);
                      }}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span className="font-medium">{project.name}</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        <div className="text-xs text-blue-600 mt-2">
                          Created: {formatDate(project.created_at)}
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProjects.slice(0, 6).map((project) => (
                  <div key={project.project_id} className="flex flex-col items-start gap-4">
                    <Button
                      variant="outline"
                      className="h-auto p-4 justify-start w-full"
                      onClick={() => {
                        localStorage.setItem('selectedProjectId', project.project_id.toString());
                        router.push(`/dashboard/projects/${project.project_id}`);
                      }}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          <span className="font-medium">{project.name}</span>
                        </div>
                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                        <div className="text-xs text-blue-600 mt-2">
                          Created: {formatDate(project.created_at)}
                        </div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="archived" className="space-y-4">
              <div className="text-center py-10 text-blue-600">
                No archived projects found
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </DashboardShell>
  );
}

