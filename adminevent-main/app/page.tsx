"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);
  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setTokenExists(true);

    const fetchTotalEvents = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/events/total-events`);
        if (!response.ok) throw new Error("Failed to fetch total events");
        const data = await response.json();
        setTotalEvents(data.totalEvents);
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users/total-users`);
        if (!response.ok) throw new Error("Failed to fetch total users");
        const data = await response.json();
        setTotalUsers(data.totalUsers);
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    if (!baseUrl) {
      console.error("API base URL is not defined in .env.local");
      return;
    }

    Promise.all([fetchTotalEvents(), fetchTotalUsers()]).finally(() => {
      setLoading(false);
    });
  }, [router, baseUrl]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading && tokenExists) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="text-base sm:text-lg font-semibold text-gray-700">Duke ngarkuar panelin...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-1 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-indigo-50 to-blue-50">
      <div className="container mx-auto">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">Paneli</h2>
          </div>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="mt-4 sm:mt-0 h-10 sm:h-11 w-full sm:w-auto"
            aria-label="Dil nga llogaria"
          >
            Dilni
          </Button>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card className="relative bg-gradient-to-br from-indigo-100 to-blue-50 shadow-md rounded-lg overflow-hidden">
            <div className="absolute top-0 right-0 p-2 sm:p-3">
              <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 opacity-50" />
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-blue-500 bg-opacity-20 rounded-full">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-blue-600">Total Përdorues</p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {totalUsers !== null ? totalUsers.toLocaleString() : "Ngarkohet..."}
                  </h3>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative bg-gradient-to-br from-green-100 to-emerald-50 shadow-md rounded-lg overflow-hidden">
            <div className="absolute top-0 right-0 p-2 sm:p-3">
              <ArrowUpRight className="h-5 w-5 sm:h-6 sm:w-6 text-green-400 opacity-50" />
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="p-2 sm:p-3 bg-green-500 bg-opacity-20 rounded-full">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium text-green-600">Total Evente</p>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    {totalEvents !== null ? totalEvents.toLocaleString() : "Ngarkohet..."}
                  </h3>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 mt-6 sm:mt-8">
          {/* Users Bar Chart */}
          <Card className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Total Përdorues</h3>
            <div aria-label={`Grafik që tregon ${totalUsers || 0} përdorues`}>
              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                <BarChart data={[{ name: "Përdorues", value: totalUsers || 0 }]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Events Bar Chart */}
          <Card className="p-4 sm:p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Total Evente</h3>
            <div aria-label={`Grafik që tregon ${totalEvents || 0} evente`}>
              <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
                <BarChart data={[{ name: "Evente", value: totalEvents || 0 }]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis allowDecimals={false} fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
