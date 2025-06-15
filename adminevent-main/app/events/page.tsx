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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { sq } from "date-fns/locale"; // Shto locale për shqip

// Përcakto interfejsin për Event
interface Event {
  _id: string;
  title: string;
  date: string;
  category: string;
  location: string;
  capacity: number;
  description?: string;
  image?: string;
}

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [tokenExists, setTokenExists] = useState(false);
  const [isDeleteConfirm, setIsDeleteConfirm] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Gjendja për modalin e shtimit të eventit të ri dhe të dhënat e formularit
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

  // Merr eventet nga API
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setTokenExists(true);
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/events`);
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Gabim gjatë marrjes së eventeve:", error);
      }
    };

    fetchEvents();
  }, [router, baseUrl]);

  // Filtro eventet bazuar në kërkimin
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fshi një event
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/events/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
        setDeleteSuccess(true);
        setIsDeleteConfirm(null);
        toast.success("Eventi u fshi me sukses");
      } else {
        console.log("Dështoi fshirja e eventit");
        toast.error("Gabim gjatë fshirjes së eventit");
      }
    } catch (err) {
      console.log("Gabim gjatë fshirjes:", err);
      toast.error("Gabim gjatë fshirjes së eventit");
    }
  };

  // Anulo fshirjen
  const cancelDelete = () => {
    setIsDeleteConfirm(null);
  };

  // Përditëso eventin
  const handleUpdate = async () => {
    if (!editingEvent || !editingEvent._id) return;

    try {
      // Konverto datën në UTC
      const utcDate = editingEvent.date ? new Date(editingEvent.date).toISOString() : undefined;

      const response = await fetch(`${baseUrl}/api/events/${editingEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingEvent,
          date: utcDate, // Dërgo datën në UTC
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error("Gabim: " + error.error);
        return;
      }

      const updated = await response.json();
      setEvents((prev) =>
        prev.map((e) => (e._id === updated._id ? updated : e))
      );
      setIsEditing(false);
      setEditingEvent(null);
      toast.success("Eventi u përditësua me sukses");
    } catch (error) {
      console.error("Gabim gjatë përditësimit:", error);
      toast.error("Gabim gjatë përditësimit të eventit");
    }
  };

  // Konverto datën ISO në formatin datetime-local
  const toDatetimeLocal = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch (error) {
      console.error("Gabim gjatë konvertimit të datës:", error);
      return "";
    }
  };

  // Fillo editimin e një eventi
  const handleEditClick = (event: Event) => {
    setEditingEvent({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: toDatetimeLocal(event.date), // Formato për datetime-local
      location: event.location,
      capacity: event.capacity,
      category: event.category,
      image: event.image,
    });
    setIsEditing(true);
  };

  // Ndërro gjendjen e modalit të shtimit të eventit
  const handleAddNewEvent = () => {
    setIsAdding(!isAdding);
  };

  // Menaxho ndryshimet në fushat e formularit për eventin e ri
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setNewEvent({ ...newEvent, [field]: e.target.value });
  };

  // Menaxho ndryshimin e skedarit të imazhit
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewEvent({ ...newEvent, image: e.target.files[0] });
    }
  };

  // Krijo një event të ri duke përdorur FormData
  const handleCreateEvent = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("date", new Date(newEvent.date).toISOString()); // Konverto në UTC
      formData.append("category", newEvent.category);
      formData.append("location", newEvent.location);
      formData.append("capacity", newEvent.capacity.toString());
      if (newEvent.image) {
        formData.append("image", newEvent.image);
      }
      // Shto organizatorin (nëse është i nevojshëm)
      formData.append("organizer", "66991a19c345b7e2e0b0e0b8"); // Zëvendëso me ID-në e vërtetë

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
        toast.success("Eventi u krijua me sukses");
      } else {
        const error = await response.json();
        console.error("Dështoi krijimi i eventit:", error);
        toast.error("Gabim gjatë krijimit të eventit: " + error.error);
      }
    } catch (error) {
      console.error("Gabim gjatë krijimit të eventit:", error);
      toast.error("Gabim gjatë krijimit të eventit");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Menaxhimi i eventeve
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Organizo dhe menaxho eventet në universitet
          </p>
        </div>
        <Button onClick={handleAddNewEvent}>
          <Plus className="mr-2 h-4 w-4" /> Shto Event
        </Button>
      </div>

      {/* Mesazhi i suksesit për fshirje */}
      {deleteSuccess && (
        <div className="p-4 mb-4 bg-green-100 text-green-700 rounded">
          Eventi u fshi me sukses!
        </div>
      )}

      {/* Dialogu i konfirmimit për fshirje */}
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

      {/* Modali për shtimin e eventit të ri */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
            <h2 className="text-lg font-bold">Shto një event të ri</h2>
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
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => handleInputChange(e, "date")}
            />
            <Input
              type="number"
              value={newEvent.capacity}
              onChange={(e) => handleInputChange(e, "capacity")}
              placeholder="Kapaciteti"
            />
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleAddNewEvent}>
                Anulo
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
                <h3 className="text-3xl font-bold text-gray-900">{events.length}</h3>
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

      {/* Tabela e eventeve */}
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
                    {format(parseISO(event.date), "dd MMMM yyyy, HH:mm", { locale: sq })} {/* Shfaq në lokal */}
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
                    onClick={() => setIsDeleteConfirm(event._id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Modali për editimin e eventit */}
        {isEditing && editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
              <h2 className="text-lg font-bold">Përditëso Eventin</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor={`title-${editingEvent._id}`} className="text-sm sm:text-base">
                    Titulli
                  </Label>
                  <Input
                    id={`title-${editingEvent._id}`}
                    value={editingEvent.title || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, title: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${editingEvent._id}`} className="text-sm sm:text-base">
                    Përshkrimi
                  </Label>
                  <Input
                    id={`description-${editingEvent._id}`}
                    value={editingEvent.description || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, description: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`date-${editingEvent._id}`} className="text-sm sm:text-base">
                    Data dhe Ora
                  </Label>
                  <Input
                    id={`date-${editingEvent._id}`}
                    type="datetime-local"
                    value={editingEvent.date || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, date: e.target.value })
                    }
                    required
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`location-${editingEvent._id}`} className="text-sm sm:text-base">
                    Vendndodhja
                  </Label>
                  <Input
                    id={`location-${editingEvent._id}`}
                    value={editingEvent.location || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, location: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`capacity-${editingEvent._id}`} className="text-sm sm:text-base">
                    Kapaciteti
                  </Label>
                  <Input
                    id={`capacity-${editingEvent._id}`}
                    type="number"
                    value={editingEvent.capacity || ""}
                    onChange={(e) =>
                      setEditingEvent({
                        ...editingEvent,
                        capacity: parseInt(e.target.value) || undefined,
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`category-${editingEvent._id}`} className="text-sm sm:text-base">
                    Kategoria
                  </Label>
                  <Select
                    value={editingEvent.category || ""}
                    onValueChange={(value) =>
                      setEditingEvent({ ...editingEvent, category: value })
                    }
                  >
                    <SelectTrigger id={`category-${editingEvent._id}`} className="w-full">
                      <SelectValue placeholder="Zgjidh kategorinë" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inxh.Kompjuterike">Inxhinieri Kompjuterike</SelectItem>
                      <SelectItem value="Inxh.Mekanike">Inxhinieri Mekanike</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`image-${editingEvent._id}`} className="text-sm sm:text-base">
                    URL e Imazhit
                  </Label>
                  <Input
                    id={`image-${editingEvent._id}`}
                    value={editingEvent.image || ""}
                    onChange={(e) =>
                      setEditingEvent({ ...editingEvent, image: e.target.value })
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="w-full sm:w-auto">Ruaj ndryshimet</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto"
                  >
                    Anulo
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}