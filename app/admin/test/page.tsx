"use client";

import { AdminHeader } from "../components/admin-header";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TestPage() {
  return (
    <div className="container mx-auto py-10">
      <AdminHeader heading="Test Page" text="This is a test page to verify that AdminHeader component works.">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </AdminHeader>
      
      <div className="mt-8 p-4 border rounded-md">
        <h2 className="text-xl font-medium mb-4">Admin Header Test</h2>
        <p>If you can see this page with the header above, the AdminHeader component is working correctly.</p>
      </div>
    </div>
  );
} 