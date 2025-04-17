"use client";

import { cn } from "@/lib/utils";
import { Calendar, LayoutDashboard, Users, ClipboardList, UserCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-blue-400",
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    color: "text-blue-300",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/events",
    color: "text-blue-500",
  },
  {
    label: "Registrations",
    icon: ClipboardList,
    href: "/registrations",
    color: "text-blue-600",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-dark-blue border-r border-gray-800">
      <div className="p-6 flex items-center gap-3">
        <Calendar className="h-8 w-8 text-blue-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          UniEvents
        </h1>
      </div>

      <div className="flex-1 px-4 space-y-2 mt-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              pathname === route.href
                ? "bg-blue-900 shadow-lg border-l-4 border-blue-400 text-white"
                : "text-gray-300 hover:bg-blue-700/50 hover:text-white",
              "group relative"
            )}
          >
            <route.icon
              className={cn(
                "h-5 w-5 transition-colors duration-200",
                pathname === route.href
                  ? route.color
                  : "text-gray-500 group-hover:text-white"
              )}
            />
            <span
              className={cn(
                "transition-colors duration-200",
                pathname === route.href ? "text-white font-semibold" : "group-hover:text-white"
              )}
            >
              {route.label}
            </span>
            {pathname === route.href && (
              <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-400" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
