"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";

interface Registration {
  _id: string;
  user: { name: string; email: string };
  event: { title: string; date: string };
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

export default function RegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [newStatus, setNewStatus] = useState<"pending" | "confirmed" | "cancelled">("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchRegistrations = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/registrations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch registrations");
        }

        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to load registrations:", error);
        toast.error("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [router]);

  const handleEditStatus = (registration: Registration) => {
    setSelectedRegistration(registration);
    setNewStatus(registration.status);
    setIsModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedRegistration) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token missing");
        router.push("/login");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/registrations/${selectedRegistration._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedRegistration = await response.json();

      if (response.ok) {
        setRegistrations(
          registrations.map((reg) =>
            reg._id === updatedRegistration._id ? updatedRegistration : reg
          )
        );
        setIsModalOpen(false);
        toast.success("Registration status updated successfully");
      } else {
        console.error("Failed to update registration status:", updatedRegistration);
        toast.error(updatedRegistration.error || "Failed to update registration status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating registration status");
    }
  };

  if (loading) {
    return <div className="flex-1 p-8 pt-6">Loading...</div>;
  }

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
            {registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No active registrations.
                </TableCell>
              </TableRow>
            ) : (
              registrations
              .filter((registration) => registration.event && registration.user)
              .map((registration) => (
                <TableRow key={registration._id}>
                  <TableCell>{registration.user.name}</TableCell>
                  <TableCell>{registration.event.title}</TableCell>
                  <TableCell>{registration.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mr-2"
                      onClick={() => handleEditStatus(registration)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal for editing status */}
      {isModalOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h3 className="text-xl font-bold mb-4">Edit Registration Status</h3>
            <div className="mb-4">
              <label htmlFor="user" className="block mb-2">
                User
              </label>
              <input
                id="user"
                type="text"
                value={selectedRegistration.user.name}
                readOnly
                className="w-full border p-2 rounded mb-4"
              />
              <label htmlFor="event" className="block mb-2">
                Event
              </label>
              <input
                id="event"
                type="text"
                value={selectedRegistration.event.title}
                readOnly
                className="w-full border p-2 rounded mb-4"
              />
              <label htmlFor="status" className="block mb-2">
                Status
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value as "pending" | "confirmed" | "cancelled")
                }
                className="w-full border p-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleStatusChange}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}