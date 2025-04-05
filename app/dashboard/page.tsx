"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "./components/dashboard-header"
import { DashboardShell } from "./components/dashboard-shell"
import { ProjectCard } from "./components/project-card"
import { RecentActivity } from "./components/recent-activity"
import { Overview } from "./components/overview"

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role"); // Assuming you store user role in localStorage

    if (!token) {
      router.push("/login");
      return;
    }

    // If user is not admin, redirect to projects page
    if (userRole !== "admin") {
      router.push("/dashboard/projects");
      return;
    }
  }, [router]);

  return null; // or a loading spinner while checking
}

