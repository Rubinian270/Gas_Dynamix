"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FlaskRoundIcon as Flask, Lock, Mail, CheckCircle } from "lucide-react"
import { BubblesBackground } from "../components/bubbles-background"
import { FormEvent, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("Login Successful!");
  const [redirectMessage, setRedirectMessage] = useState("Redirecting...");
  const router = useRouter();

  // Redirect after showing success animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loginSuccess) {
      timer = setTimeout(() => {
        // Get user role from localStorage
        const userRole = localStorage.getItem("user_role");
        
        // Redirect based on role
        if (userRole === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard/projects");
        }
      }, 2000); // Wait for animation to complete before redirecting
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [loginSuccess, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("https://gaxmixer-production.up.railway.app/login", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Login failed");
      }

      const data = await response.json();
      
      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("user_role", data.role);
        localStorage.setItem("user_name", data.name);
        
        // Update success message based on role
        if (data.role === "admin") {
          setRedirectMessage("Redirecting to Admin Panel...");
        } else {
          setRedirectMessage("Redirecting to Dashboard...");
        }
      }
      
      // Show success animation before redirecting
      setLoginSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50 z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794027-082a231dfe23?w=1920&h=1080&fit=crop&q=80')] bg-cover bg-center opacity-5 z-0"></div>

      {/* Bubbles background */}
      <BubblesBackground />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-200 rounded-full opacity-20 blur-3xl transform translate-x-1/3 -translate-y-1/3 z-0 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-300 rounded-full opacity-20 blur-3xl transform -translate-x-1/3 translate-y-1/3 z-0 animate-pulse-slow animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-20 blur-3xl z-0 animate-pulse-slow animation-delay-1000"></div>

      {/* Success overlay - shows when login is successful */}
      <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center transition-all duration-500",
        loginSuccess ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {/* Success overlay background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/90 to-blue-600/90 backdrop-blur-md"></div>
        
        {/* Success animation container */}
        <div className="relative z-10 flex flex-col items-center text-white">
          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg shadow-green-600/30 animate-scale-up">
            <CheckCircle className="h-14 w-14 text-green-500 animate-bounce-in" />
          </div>
          <h2 className="text-3xl font-bold mb-2 animate-fade-up-1">{successMessage}</h2>
          <p className="text-white/80 animate-fade-up-2">{redirectMessage}</p>
          
          {/* Animated rings */}
          <div className="absolute w-32 h-32 border-4 border-white/30 rounded-full animate-ping-slow"></div>
          <div className="absolute w-48 h-48 border-2 border-white/20 rounded-full animate-ping-slow animation-delay-300"></div>
          <div className="absolute w-64 h-64 border border-white/10 rounded-full animate-ping-slow animation-delay-600"></div>
        </div>
      </div>

      {/* Logo */}
      <Link
        href="/"
        className="absolute left-4 sm:left-8 top-4 sm:top-8 flex items-center gap-2 font-bold text-xl text-blue-700 z-10"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-2 rounded-lg shadow-md">
          <Flask className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <span className="hidden sm:inline">GasDynamix</span>
      </Link>

      {/* Login card */}
      <Card className="w-[90%] max-w-md relative z-10 border-blue-100 shadow-2xl bg-white/95 backdrop-blur-sm mx-4 group hover:shadow-blue-200/50 transition-all duration-500">
        <div className="absolute -top-1 -bottom-1 -left-1 -right-1 bg-gradient-to-br from-blue-200 via-blue-100 to-white rounded-2xl blur-sm -z-10 group-hover:blur-md group-hover:from-blue-300 group-hover:via-blue-200 transition-all duration-500"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer rounded-xl"></div>

        <CardHeader className="space-y-1 pb-6 sm:pb-8 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-white shadow-md group-hover:from-blue-600 group-hover:to-blue-700 group-hover:scale-105 transition-all duration-300">
              <Flask className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-blue-900 group-hover:text-blue-800 transition-colors duration-300">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-blue-700/70 group-hover:text-blue-700/90 transition-colors duration-300">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
            {error && (
              <div className="p-3 text-sm bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-blue-900 flex items-center gap-2 group-hover:text-blue-800 transition-colors duration-300"
              >
                <Mail className="h-4 w-4 text-blue-700 group-hover:text-blue-600 transition-colors duration-300 group-hover:scale-110" />
                Email
              </Label>
              <div className="relative overflow-hidden rounded-md group/input">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400 h-10 sm:h-12 pl-4 pr-4 transition-all duration-200 focus:ring-2 focus:ring-blue-400/20 shadow-inner bg-white/90 relative"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-blue-900 flex items-center gap-2 group-hover:text-blue-800 transition-colors duration-300"
                >
                  <Lock className="h-4 w-4 text-blue-700 group-hover:text-blue-600 transition-colors duration-300 group-hover:scale-110" />
                  Password
                </Label>
               
              </div>
              <div className="relative overflow-hidden rounded-md group/input">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-100/10 to-blue-50/0 opacity-0 group-hover/input:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></div>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400 h-10 sm:h-12 pl-4 pr-4 transition-all duration-200 focus:ring-2 focus:ring-blue-400/20 shadow-inner bg-white/90 relative"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 sm:space-y-6 pt-2 sm:pt-4 px-4 sm:px-6">
            <Button 
              type="submit" 
              className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-blue-300/30 hover:shadow-xl relative overflow-hidden group/btn"
              disabled={isLoading || loginSuccess}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-1000 bg-[length:200%_100%] animate-shimmer"></span>
              <span className="relative">{isLoading ? "Signing In..." : "Sign In"}</span>
            </Button>
           
          </CardFooter>
        </form>
      </Card>

      {/* Bottom decorative element */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-blue-700/40 text-xs z-10 px-4">
        <span className="hidden sm:inline">Premium Gas Analysis Platform • </span>Secure Login
        <span className="hidden sm:inline"> • Enterprise Grade</span>
      </div>
    </div>
  )
}

