"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Users, Calendar, FolderTree, ArrowUpRight, Activity } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/events/total-events");
        if (!response.ok) throw new Error("Failed to fetch total events");
        const data = await response.json();
        setTotalEvents(data.totalEvents);
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/total-users");
        if (!response.ok) throw new Error("Failed to fetch total users");
        const data = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalEvents();
    fetchTotalUsers();
  }, [router]);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium text-green-500">Live Updates</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="absolute top-0 right-0 p-3">
            <ArrowUpRight className="h-6 w-6 text-blue-400 opacity-50" />
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 bg-opacity-10 rounded-2xl">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {totalUsers !== null ? totalUsers.toLocaleString() : "..."}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Active members in your platform</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="absolute top-0 right-0 p-3">
            <ArrowUpRight className="h-6 w-6 text-green-400 opacity-50" />
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 bg-opacity-10 rounded-2xl">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Total Events</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {totalEvents !== null ? totalEvents.toLocaleString() : "..."}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Events created in the platform</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="absolute top-0 right-0 p-3">
            <ArrowUpRight className="h-6 w-6 text-purple-400 opacity-50" />
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 bg-opacity-10 rounded-2xl">
                <FolderTree className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Categories</p>
                <h3 className="text-3xl font-bold text-gray-900">10</h3>
                <p className="text-xs text-gray-500 mt-1">Available event categories</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New event created</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium">Active Events</span>
              <span className="text-sm font-bold text-green-600">24</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium">Today's Registrations</span>
              <span className="text-sm font-bold text-blue-600">12</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-sm font-medium">Pending Approvals</span>
              <span className="text-sm font-bold text-orange-600">5</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}