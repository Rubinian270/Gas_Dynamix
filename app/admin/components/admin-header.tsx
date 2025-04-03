"use client";

import { Button } from "@/components/ui/button"
import { RefreshCw, Download } from "lucide-react"

interface AdminHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function AdminHeader({ heading, text, children }: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
      <div>
        <h1 className="text-2xl font-semibold text-blue-900">{heading}</h1>
        {text && <p className="text-blue-700/60 mt-1">{text}</p>}
      </div>
      {children ? (
        children
      ) : (
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 shadow-sm"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-blue-300/30 hover:shadow-xl relative overflow-hidden group">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600/0 via-blue-600/30 to-blue-600/0 group-hover:animate-shimmer bg-[length:200%_100%]"></span>
            <Download className="mr-2 h-4 w-4 relative" />
            <span className="relative">Export Data</span>
          </Button>
        </div>
      )}
    </div>
  );
} 