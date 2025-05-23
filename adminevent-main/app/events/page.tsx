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
import { Plus, Pencil, Trash, Search, Calendar, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";



// Define the Event interface
interface Event {
  _id: string;
  title: string;
  date: string;
  category: string;
  location: string;
  capacity: number;
  // image?: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [tokenExists, setTokenExists] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<string | null>(null); 
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  

  // State for managing new event modal and form data
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState<{
    _id: string;
    title: string;
    date: string;
    category: string;
    location: string;
    capacity: number;
    image: File | null;
  }>({
    _id: "",
    title: "",
    date: "",
    category: "",
    location: "",
    capacity: 0,
    image: null,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch events from API
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setTokenExists(true); // Tregon që ekziston tokeni
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/events`);
      
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete event
  const handleDelete = async (id: string) => {
    console.log("Duke fshirë event me ID:", id);
    try {
      const res = await fetch(`${baseUrl}/api/events/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        console.log("Event u fshi");
        // Fshij eventin nga state pa pasur nevojë të rifreskosh nga API
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
        setDeleteSuccess(true); // Shfaq mesazhin e suksesit
  
        // Mbyll modalin e konfirmimit
        setIsDeleteConfirm(null);
      } else {
        console.log("Dështoi fshirja e eventit");
      }
    } catch (err) {
      console.log("Error deleting", err);
    }
  };
    // Handle cancel delete
    const cancelDelete = () => {
      setIsDeleteConfirm(null);
    };

  // Handle update event
  const handleUpdate = async () => {
    if (!editingEvent) return;

    try {
      const response = await fetch(`${baseUrl}/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingEvent),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("Gabim: " + error.error);
        return;
      }

      const updated = await response.json();
      setEvents((prev) =>
        prev.map((e) => (e._id === updated._id ? updated : e))
      );
      setIsEditing(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Gabim gjatë përditësimit:", error);
    }
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsEditing(true);
  };

  // Handle add new event modal toggle
  const handleAddNewEvent = () => {
    setIsAdding(!isAdding);
  };

  // Handle form input change for new event (tekstual)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setNewEvent({ ...newEvent, [field]: e.target.value });
  };

  // Handle file input change për imazhin
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewEvent({ ...newEvent, image: e.target.files[0] });
    }
  };

  // Handle creating a new event me file upload duke përdorur FormData
  const handleCreateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("date", newEvent.date);
      formData.append("category", newEvent.category);
      formData.append("location", newEvent.location);
      formData.append("capacity", newEvent.capacity.toString());
      if (newEvent.image) {
        formData.append("image", newEvent.image);
      }
      console.log("Dërgimi i të dhënave", formData);

      const response = await fetch(`${baseUrl}/api/events`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const createdEvent = await response.json();
        setEvents((prev) => [...prev, createdEvent]);
        setIsAdding(false);
        setNewEvent({
          _id: "",
          title: "",
          date: "",
          category: "",
          location: "",
          capacity: 0,
          image: null,
        });
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Menaxhimi i enteve
          </h2>
          <p className="text-sm text-gray-500 mt-1">
           Organizo dhe menaxho eventet ne universitet
          </p>
        </div>
        {/* <div className="flex items-center gap-4">
          <Button className="flex items-center gap-2" onClick={handleAddNewEvent}>
            <Plus className="h-4 w-4" />
            Add New Event
          </Button>
        </div> */}
      </div>


      {/* Success Message */}
      {deleteSuccess && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
          Eventi u fshi me sukses!
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-lg font-bold">A jeni të sigurt?</h2>
            <p>A dëshironi ta fshini këtë event? Nuk mund të ktheheni pas.</p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={cancelDelete}>
                Largo
              </Button>
              <Button onClick={() => handleDelete(isDeleteConfirm)}>
                Fshij
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Event Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-lg font-bold">Shto një event te ri</h2>
            <Input
              type="text"
              value={newEvent.title}
              onChange={(e) => handleInputChange(e, "title")}
              placeholder="Titulli"
            />
            <Input
              type="text"
              value={newEvent.category}
              onChange={(e) => handleInputChange(e, "category")}
              placeholder="Kategoria"
            />
            <Input
              type="text"
              value={newEvent.location}
              onChange={(e) => handleInputChange(e, "location")}
              placeholder="Lokacioni"
            />
            <Input
              type="date"
              value={newEvent.date}
              onChange={(e) => handleInputChange(e, "date")}
            />
            <Input
              type="number"
              value={newEvent.capacity}
              onChange={(e) => handleInputChange(e, "capacity")}
              placeholder="Kapaciteti"
            />
            
            {/* File Input per imazhin e eventit */}
            <Input type="file" accept="image/*" onChange={handleImageChange} />

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleAddNewEvent}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent}>Ruaj</Button>
            </div>
          </div>
        </div>
      )}

      {/* Statistika */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 bg-opacity-10 rounded-2xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Eventet totale</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {events.length}
                </h3>
            
              </div>
            </div>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 bg-opacity-10 rounded-2xl">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Lokacionet</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {new Set(events.map((e) => e.location)).size}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Vende unike</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kërkoni eventet..."
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
              <TableHead>Detajet e eventit</TableHead>
              <TableHead>Kategoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Lokacioni</TableHead>
              <TableHead className="text-right">Veprimet</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event._id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* Nëse dëshiron të shfaqësh imazhin, shto një <img> me event.image */}
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">
                        {event.capacity} të pranishëm
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {event.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2 hover:bg-gray-100"
                    onClick={() => handleEditClick(event)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setIsDeleteConfirm(event._id)} // Show delete confirmation modal
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit Event Modal */}
        {isEditing && editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
              <h2 className="text-lg font-bold">Përditëso Eventin</h2>
              <Input
                type="text"
                name="title"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
                placeholder="Titulli"
              />
              <Input
                type="text"
                name="category"
                value={editingEvent.category}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, category: e.target.value })
                }
                placeholder="Kategoria"
              />
              <Input
                type="text"
                name="location"
                value={editingEvent.location}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, location: e.target.value })
                }
                placeholder="Lokacioni"
              />
              <Input
                type="date"
                name="date"
                value={editingEvent.date.slice(0, 10)}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, date: e.target.value })
                }
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Anulo
                </Button>
                <Button onClick={handleUpdate}>Ruaj</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
