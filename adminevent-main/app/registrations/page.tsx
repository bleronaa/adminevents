"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";

interface Registration {
  _id: string;
  user: { name: string, email: string };
  event: { title: string, date: string };
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/registrations");
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to load registrations:", error);
      }
    };

    fetchRegistrations();
  }, []);

  const handleDeleteRegistration = (id: string) => {
    setRegistrations(registrations.filter((registration) => registration._id !== id));
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Registrations</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration._id}>
                <TableCell>{registration.user.name}</TableCell>
                <TableCell>{registration.event.title}</TableCell>
                <TableCell>{registration.status}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => handleDeleteRegistration(registration._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
