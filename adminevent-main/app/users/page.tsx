"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  password: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", password: "" });
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [tokenExists, setTokenExists] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setTokenExists(true);

    const fetchUsers = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së përdoruesve:", error);
        toast.error("Nuk u ngarkuan dot përdoruesit.");
      }
    };

    fetchUsers();
  }, [router]);

const handleDeleteUser = async () => {
  if (!deleteUserId) return;

  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${baseUrl}/api/users/${deleteUserId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": deleteUserId, // Shto ID-në e përdoruesit këtu
        Authorization: `Bearer ${token}`, // Opsionale, nëse përdor token
      },
    });

    if (res.ok) {
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== deleteUserId));
      toast.success("Përdoruesi u fshi me sukses.");
    } else {
      const errorData = await res.json();
      console.error("Gabim nga serveri:", errorData);
      toast.error(errorData.error || "Fshirja dështoi.");
    }
  } catch (error) {
    console.error("Gabim gjatë fshirjes së përdoruesit:", error);
    toast.error("Gabim gjatë fshirjes së përdoruesit.");
  } finally {
    setIsDeleteOpen(false);
    setDeleteUserId(null);
  }
};

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedUser(user);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editedUser) return;

    try {
      const res = await fetch(`${baseUrl}/api/users/${editedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedUser),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) => (user._id === editedUser._id ? editedUser : user))
        );
        toast.success("Përdoruesi u përditësua me sukses.");
        closeEditDialog();
      } else {
        toast.error("Ndodhi një gabim gjatë ruajtjes së ndryshimeve.");
      }
    } catch (error) {
      console.error("Gabim gjatë përditësimit të përdoruesit:", error);
      toast.error("Gabim gjatë përditësimit të përdoruesit.");
    }
  };

  const handleAddUser = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newUser, status: "active" }),
      });

      if (res.ok) {
        const addedUser = await res.json();
        setUsers((prev) => [...prev, addedUser]);
        toast.success("Përdoruesi u shtua me sukses.");
        closeAddDialog();
      } else {
        toast.error("Ndodhi një gabim gjatë shtimit të përdoruesit.");
      }
    } catch (error) {
      console.error("Gabim gjatë shtimit të përdoruesit:", error);
      toast.error("Gabim gjatë shtimit të përdoruesit.");
    }
  };

  const closeEditDialog = () => {
    setSelectedUser(null);
    setEditedUser(null);
    setIsEditOpen(false);
  };

  const closeAddDialog = () => {
    setNewUser({ name: "", email: "", role: "", password: "" });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Menaxhimi i Përdoruesve
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Menaxhoni dhe monitoroni llogaritë dhe lejet e përdoruesve
            </p>
          </div>
          {/* <Dialog>
            <DialogTrigger asChild>
              <Button
                className="mt-4 sm:mt-0 h-10 sm:h-11 w-full sm:w-auto"
                aria-label="Shto përdorues të ri"
              >
                <Plus className="h-4 w-4 mr-2" />
                Shto Përdorues
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Shto Përdorues të Ri</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium">Emri</label>
                  <Input
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="h-10 sm:h-11"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium">Email</label>
                  <Input
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="h-10 sm:h-11"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium">Roli</label>
                  <Input
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="h-10 sm:h-11"
                  />
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-medium">Fjalëkalimi</label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="h-10 sm:h-11"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={closeAddDialog}>
                  Anulo
                </Button>
                <Button onClick={handleAddUser}>Shto</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> */}
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-md rounded-lg">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-500 bg-opacity-10 rounded-2xl">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-blue-600">Total Përdorues</p>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{users.length}</h3>
              </div>
            </div>
          </Card>
        </div>

        <div className="bg-white rounded-xl border shadow-md overflow-hidden">
          <div className="p-4 sm:p-6 border-b bg-gray-50">
            <div className="relative flex items-center">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              <Input
                placeholder="Kërko përdorues..."
                className="pl-8 sm:pl-10 w-full bg-gray-100 focus:ring-2 focus:ring-blue-500 h-10 sm:h-11"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Kërko përdorues sipas emrit ose email-it"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-full table-auto">
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableHead className="text-left text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3">
                    Përdorues
                  </TableHead>
                  <TableHead className="text-left text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3">
                    Rol
                  </TableHead>
                  <TableHead className="text-right text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider px-4 sm:px-6 py-3">
                    Veprime
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow
                    key={user._id}
                    className="bg-white hover:shadow-md transition-shadow duration-200 rounded-lg"
                  >
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="text-sm sm:text-base font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium ${
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-blue-600 hover:text-blue-800 h-8 sm:h-9"
                          onClick={() => handleEditUser(user)}
                          aria-label={`Ndrysho përdoruesin ${user.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 h-8 sm:h-9"
                          onClick={() => {
                            setDeleteUserId(user._id);
                            setIsDeleteOpen(true);
                          }}
                          aria-label={`Fshi përdoruesin ${user.name}`}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Dialog për Modifikim */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Ndrysho Përdorues</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs sm:text-sm font-medium">Emri</label>
                <Input
                  value={editedUser?.name || ""}
                  onChange={(e) => setEditedUser({ ...editedUser!, name: e.target.value })}
                  className="h-10 sm:h-11"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium">Email</label>
                <Input
                  value={editedUser?.email || ""}
                  onChange={(e) => setEditedUser({ ...editedUser!, email: e.target.value })}
                  className="h-10 sm:h-11"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium">Roli</label>
                <Input
                  value={editedUser?.role || ""}
                  onChange={(e) => setEditedUser({ ...editedUser!, role: e.target.value })}
                  className="h-10 sm:h-11"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog}>
                Anulo
              </Button>
              <Button onClick={handleSaveEdit}>Ruaj</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog për Konfirmim Fshirjeje */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-[90vw] sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Konfirmo Fshirjen</DialogTitle>
            </DialogHeader>
            <p className="text-sm sm:text-base text-gray-600">
              A jeni i sigurt që doni të fshini këtë përdorues? Ky veprim nuk mund të zhbëhet.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Anulo
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                Fshi
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}