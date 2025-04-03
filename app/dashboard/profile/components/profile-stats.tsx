"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Shield, Mail, Hash } from "lucide-react";
import { api } from "../../../services/api";

export function ProfileStats() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500">
        Failed to load user data
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-blue-100 hover:border-blue-200 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Account Type</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <span className="text-lg font-semibold text-blue-900 capitalize">{user.role}</span>
        </CardContent>
      </Card>

      <Card className="border-blue-100 hover:border-blue-200 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">User ID</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-blue-500" />
          <span className="text-lg font-semibold text-blue-900">{user.id}</span>
        </CardContent>
      </Card>

      <Card className="border-blue-100 hover:border-blue-200 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Username</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-500" />
          <span className="text-lg font-semibold text-blue-900">{user.username}</span>
        </CardContent>
      </Card>

      <Card className="border-blue-100 hover:border-blue-200 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-600">Email</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-500" />
          <span className="text-lg font-semibold text-blue-900">{user.email}</span>
        </CardContent>
      </Card>
    </div>
  );
}

