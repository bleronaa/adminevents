'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog } from "@headlessui/react"; // Import Dialog
import { useRouter } from "next/router"; // Use useRouter hook here

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
  avatar: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users");
        const data = await response.json();
        console.log("Përdoruesit:", data); 
        setUsers(data); 
      } catch (error) {
        console.error("Gabim gjatë marrjes së përdoruesve:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    const id = userId;
    if (!id) {
      console.error("ID e përdoruesit është e pavlefshme");
      return;
    }

    const confirmDelete = window.confirm("A jeni i sigurt që doni të fshini këtë përdorues?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
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
    setIsOpen(true); // Hap dialogun
  };

  const handleSaveEdit = async () => {
    if (editedUser) {
      try {
        const res = await fetch(`http://localhost:3001/api/users/${editedUser._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedUser),
        });

        if (res.ok) {
          // Update the users list after editing
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user._id === editedUser._id ? editedUser : user
            )
          );
          closeDialog();
        } else {
          console.error("Ndodhi një gabim gjatë ruajtjes së ndryshimeve");
        }
      } catch (error) {
        console.error("Gabim gjatë përditësimit të përdoruesit:", error);
      }
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
        <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
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

      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
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
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 hover:bg-gray-100"
                    onClick={() => handleEditUser(user)} // Open edit dialog
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

      {/* Dialog for editing user */}
      {isOpen && (
        <Dialog open={isOpen} onClose={closeDialog}>
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
              <Dialog.Title className="text-xl font-semibold">Edit User</Dialog.Title>
              <div className="mt-4">
                {selectedUser && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Name</label>
                      <Input
                        value={editedUser?.name || ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser!, name: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Email</label>
                      <Input
                        value={editedUser?.email || ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser!, email: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Role</label>
                      <Input
                        value={editedUser?.role || ""}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser!, role: e.target.value })
                        }
                        className="mt-2"
                      />
                    </div>
                  </>
                )}
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
