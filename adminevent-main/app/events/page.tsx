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
import { Plus, Pencil, Trash, Search, Calendar, MapPin, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

// Define the Event interface
interface Event {
  _id: number;
  title: string;
  date: string;
  category: string;
  location: string;
  attendees: number;
  image: string;
}

// Dummy data for testing purposes
const DUMMY_EVENTS: Event[] = [
  {
    _id: 1,
    title: "Tech Conference 2025",
    date: "2025-03-15",
    category: "Technology",
    location: "Main Auditorium",
    attendees: 120,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop"
  },
  {
    _id: 2,
    title: "Annual Career Fair",
    date: "2025-04-20",
    category: "Career",
    location: "University Hall",
    attendees: 250,
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop"
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(DUMMY_EVENTS);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/events");
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle delete event
  const handleDelete = (id: number) => {
    // Add your delete logic here
    setEvents((prevEvents) => prevEvents.filter((event) => event._id !== id));
  };

  // Handle update event
  const handleUpdate = (updatedEvent: Event) => {
    // Add your update logic here
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Events Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Organize and manage your university events
          </p>
        </div>
        <div className="flex items-center gap-4">
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Event
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 bg-opacity-10 rounded-2xl">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Total Events</p>
                <h3 className="text-3xl font-bold text-gray-900">{events.length}</h3>
                <p className="text-xs text-gray-500 mt-1">Active events this month</p>
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
                <p className="text-sm font-medium text-purple-600">Locations</p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {new Set(events.map(e => e.location)).size}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Unique venues</p>
              </div>
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
                placeholder="Search events..."
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
              <TableHead>Event Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event._id} className="hover:bg-gray-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-12 w-20 rounded-lg object-cover"
                    />
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.attendees} attendees</div>
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
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
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
                  <Button variant="ghost"
                   size="icon"
                    className="mr-2 hover:bg-gray-100">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDelete(event._id)}
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
