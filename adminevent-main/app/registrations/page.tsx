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
import { Pencil } from "lucide-react";
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

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchRegistrations = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/registrations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch registrations");

        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to load registrations:", error);
        toast.error("Nuk u mundësua ngarkimi i regjistrimeve.");
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
        toast.error("Token mungon");
        router.push("/login");
        return;
      }

      const response = await fetch(
        `${baseUrl}/api/registrations/${selectedRegistration._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const updatedRegistration = await response.json();

      if (response.ok) {
        setRegistrations((prev) =>
          prev.map((reg) => (reg._id === updatedRegistration._id ? updatedRegistration : reg))
        );
        setIsModalOpen(false);
        toast.success("Statusi u përditësua me sukses");
      } else {
        toast.error(updatedRegistration.error || "Gabim gjatë përditësimit");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gabim gjatë përditësimit të regjistrimit");
    }
  };

  if (loading) {
    return <div className="flex-1 p-8 pt-6">Duke u ngarkuar...</div>;
  }

  const validRegistrations = registrations.filter(
    (reg) => reg.user && reg.event
  );

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Regjistrimet</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Përdoruesi</TableHead>
              <TableHead>Ngjarja</TableHead>
              <TableHead>Statusi</TableHead>
              <TableHead className="text-right">Veprime</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validRegistrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nuk ka regjistrime aktive për momentin.
                </TableCell>
              </TableRow>
            ) : (
              validRegistrations.map((registration) => (
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

      {/* Modal */}
      {isModalOpen && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Ndrysho statusin</h3>
            <div className="mb-4">
              <label className="block mb-1">Përdoruesi</label>
              <input
                type="text"
                value={selectedRegistration.user.name}
                readOnly
                className="w-full border p-2 rounded mb-3"
              />

              <label className="block mb-1">Ngjarja</label>
              <input
                type="text"
                value={selectedRegistration.event.title}
                readOnly
                className="w-full border p-2 rounded mb-3"
              />

              <label className="block mb-1">Statusi</label>
              <select
                value={newStatus}
                onChange={(e) =>
                  setNewStatus(e.target.value as "pending" | "confirmed" | "cancelled")
                }
                className="w-full border p-2 rounded"
              >
                <option value="pending">Në pritje</option>
                <option value="confirmed">I konfirmuar</option>
                <option value="cancelled">Anuluar</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Anulo
              </Button>
              <Button onClick={handleStatusChange}>Ruaj</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
