"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar, LayoutDashboard, Users, ClipboardList, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const routes = [
  {
    label: "Paneli",
    icon: LayoutDashboard,
    href: "/",
    color: "text-blue-400",
  },
  {
    label: "Përdorues",
    icon: Users,
    href: "/users",
    color: "text-blue-300",
  },
  {
    label: "Evente",
    icon: Calendar,
    href: "/events",
    color: "text-blue-500",
  },
  // {
  //   label: "Regjistrime",
  //   icon: ClipboardList,
  //   href: "/registrations",
  //   color: "text-blue-600",
  // },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-4 sm:p-6 flex items-center gap-3">
        <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          UniEvents
        </h1>
      </div>

      <div className="flex-1 px-3 sm:px-4 space-y-2 mt-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-xl transition-all duration-200",
              pathname === route.href
                ? "bg-blue-900 shadow-md border-l-4 border-blue-400 text-white"
                : "text-gray-300 hover:bg-blue-700/50 hover:text-white",
              "group relative"
            )}
            onClick={() => setIsOpen(false)}
          >
            <route.icon
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200",
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
              <div className="absolute left-0 top-1/2 h-6 sm:h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-400" />
            )}
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex">
      {/* Sidebar për Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-dark-blue border-r border-gray-800">
        {sidebarContent}
      </div>

      {/* Hamburger Menu për Mobile */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Hap menunë anësore">
              <Menu className="h-6 w-6 text-gray-800" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px] bg-dark-blue border-r border-gray-800 p-0">
            <VisuallyHidden>
              <SheetTitle>Menuja Anësore e Navigimit</SheetTitle>
            </VisuallyHidden>
            <div className="flex justify-between items-center p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-blue-400" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  UniEvents
                </h1>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Mbyll menunë">
                <X className="h-6 w-6 text-gray-300" />
              </Button>
            </div>
            <div className="flex-1 px-3 sm:px-4 space-y-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-xl transition-all duration-200",
                    pathname === route.href
                      ? "bg-blue-900 shadow-md border-l-4 border-blue-400 text-white"
                      : "text-gray-300 hover:bg-blue-700/50 hover:text-white",
                    "group relative"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <route.icon
                    className={cn(
                      "h-4 w-4 sm:h-5 sm:w-5 transition-colors duration-200",
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
                    <div className="absolute left-0 top-1/2 h-6 sm:h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-400" />
                  )}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}