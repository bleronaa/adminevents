"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Users, Calendar, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);
  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setTokenExists(true); // Tregon që ekziston tokeni

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

    Promise.all([fetchTotalEvents(), fetchTotalUsers()]).finally(() => {
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading && tokenExists) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-blue-100">
        <div className="text-lg font-semibold text-gray-700">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 pt-6 bg-gradient-to-r from-indigo-50 to-blue-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-800">Paneli</h2>
          <p className="text-lg text-gray-600 mt-1">Performanca e platformës suaj me një shikim</p>
        </div>
        <button 
          onClick={handleLogout}
          className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg"
        >
          Dilni
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative bg-gradient-to-br from-indigo-100 to-blue-50 shadow-xl rounded-lg overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <ArrowUpRight className="h-6 w-6 text-blue-400 opacity-50" />
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 bg-opacity-20 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {totalUsers !== null ? totalUsers.toLocaleString() : "Loading..."}
                </h3>
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative bg-gradient-to-br from-green-100 to-emerald-50 shadow-xl rounded-lg overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
            <ArrowUpRight className="h-6 w-6 text-green-400 opacity-50" />
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 bg-opacity-20 rounded-full">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Total Events</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {totalEvents !== null ? totalEvents.toLocaleString() : "Loading..."}
                </h3>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {/* Users Bar Chart */}
        <Card className="p-6 bg-white shadow-xl rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Total Users</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: "Users", value: totalUsers || 0 }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Events Bar Chart */}
        <Card className="p-6 bg-white shadow-xl rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Total Events</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[{ name: "Events", value: totalEvents || 0 }]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
