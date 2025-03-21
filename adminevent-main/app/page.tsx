
"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { Users, Calendar, FolderTree } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [totalEvents, setTotalEvents] = useState<number | null>(null);
  const [totalUsers, setTotalUsers] = useState<number | null>(null);



  useEffect(() => {
    //  

    // Fetch the total events count from the API
    const fetchTotalEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/events/total-events");
        if (!response.ok) {
          throw new Error("Failed to fetch total events");
        }

        const data = await response.json();
        setTotalEvents(data.totalEvents); // Store the total number of events
      } catch (error) {
        console.error("Error fetching total events:", error);
      }
    };

    fetchTotalEvents();

    const fetchTotalUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users/total-users");
        if (!response.ok) {
          throw new Error("Failed to fetch total users");
        }

        const data = await response.json();
        setTotalUsers(data.totalUsers); // Store the total number of users
      } catch (error) {
        console.error("Error fetching total users:", error);
      }
    };

    fetchTotalUsers();
  }, [router]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{totalUsers !== null ? totalUsers : "Loading..."}</h3> {/* Example static value, change this to dynamic if needed */}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Events</p>
              <h3 className="text-2xl font-bold"> {totalEvents !== null ? totalEvents : "Loading..."}</h3> {/* Display total events */}
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FolderTree className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <h3 className="text-2xl font-bold">10</h3> {/* Example static value, replace as needed */}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
