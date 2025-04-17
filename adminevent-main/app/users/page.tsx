'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog } from "@headlessui/react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  password: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  });
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së përdoruesve:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!userId) return;

    const confirmDelete = window.confirm("A jeni i sigurt që doni të fshini këtë përdorues?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      } else {
        console.error("Fshirja dështoi");
      }
    } catch (error) {
      console.error("Gabim gjatë fshirjes së përdoruesit:", error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditedUser(user);
    setIsOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editedUser) return;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${editedUser._id}`, {
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
        closeDialog();
      } else {
        console.error("Ndodhi një gabim gjatë ruajtjes së ndryshimeve");
      }
    } catch (error) {
      console.error("Gabim gjatë përditësimit të përdoruesit:", error);
    }
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setEditedUser(null);
    setIsOpen(false);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Users Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and monitor user accounts and permissions
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 bg-opacity-10 rounded-2xl">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search users..."
              className="pl-10 bg-gray-100 focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Table className="divide-y divide-gray-200 table-auto w-full">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="text-left text-sm font-semibold text-gray-600 py-3 px-4">User</TableHead>
              <TableHead className="text-left text-sm font-semibold text-gray-600 py-3 px-4">Role</TableHead>
              <TableHead className="text-right text-sm font-semibold text-gray-600 py-3 px-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} className="hover:bg-gray-100 transition-all duration-200">
                <TableCell className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === "Admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 hover:bg-gray-100 text-blue-500"
                    onClick={() => handleEditUser(user)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {isOpen && (
        <Dialog open={isOpen} onClose={closeDialog}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <Dialog.Title className="text-xl font-semibold">Edit User</Dialog.Title>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={editedUser?.name || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser!, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={editedUser?.email || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser!, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={editedUser?.role || ""}
                    onChange={(e) =>
                      setEditedUser({ ...editedUser!, role: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={closeDialog}>Cancel</Button>
                <Button className="ml-2" onClick={handleSaveEdit}>Save</Button>
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
