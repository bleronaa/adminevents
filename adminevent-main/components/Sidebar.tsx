"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Users, Calendar, FolderTree, LayoutDashboard, ClipboardList } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-indigo-500"
  },
  {
    label: "Users",
    icon: Users,
    href: "/users",
    color: "text-emerald-500"
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/events",
    color: "text-blue-500"
  },
  {
    label: "Categories",
    icon: FolderTree,
    href: "/categories",
    color: "text-violet-500"
  },
  {
    label: "Registrations",
    icon: ClipboardList,
    href: "/registrations",
    color: "text-amber-500"
  }
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <Calendar className="h-8 w-8 text-indigo-600" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            UniEvents
          </h1>
        </Link>
      </div>

      <div className="flex-1 px-4 space-y-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
              pathname === route.href
                ? "bg-gray-50 shadow-sm border border-gray-100"
                : "text-gray-600 hover:bg-gray-50/50",
              "group relative overflow-hidden"
            )}
          >
            <route.icon 
              className={cn(
                "h-5 w-5 transition-colors duration-200",
                pathname === route.href ? route.color : "text-gray-400 group-hover:text-gray-600"
              )} 
            />
            <span className={cn(
              "transition-colors duration-200",
              pathname === route.href ? "text-gray-900" : "group-hover:text-gray-900"
            )}>
              {route.label}
            </span>
            {pathname === route.href && (
              <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600" />
            )}
          </Link>
        ))}
      </div>

      <div className="p-4 mt-auto">
        <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Admin Portal</p>
              <p className="text-xs text-gray-500">Manage your university events</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}