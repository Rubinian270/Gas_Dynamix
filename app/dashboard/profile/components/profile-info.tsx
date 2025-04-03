"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar, Building, GraduationCap } from "lucide-react"
import { api, User } from "../../../services/api"

export function ProfileInfo() {
  const [user, setUser] = useState<User | null>(null);
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-blue-100">
          <AvatarImage src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`} />
          <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-blue-900">{user.username}</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {user.role}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
          <Mail className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm text-blue-600">Email</p>
            <p className="text-sm font-medium text-blue-900">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50/50 transition-colors">
          <Building className="h-4 w-4 text-blue-600" />
          <div>
            <p className="text-sm text-blue-600">User ID</p>
            <p className="text-sm font-medium text-blue-900">{user.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

