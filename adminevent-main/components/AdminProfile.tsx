// app/admin-profile/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, UserCircle } from "lucide-react";

export default function AdminProfile() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // nëse nuk ka token, redirect to login
    if (!token) {
      router.push("/login");
    }

    // shembull për marrje të email-it nga token ose localStorage
    const storedEmail = localStorage.getItem("adminEmail");
    if (storedEmail) {
      setAdminEmail(storedEmail);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminEmail");
    router.push("/login");
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-4">
        <UserCircle className="w-16 h-16 text-indigo-600" />
        <div>
          <h2 className="text-xl font-bold text-gray-800">Admin Profile</h2>
          <p className="text-sm text-gray-600">{adminEmail || "Loading..."}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="p-4 border rounded-md">
          <p><strong>Role:</strong> Administrator</p>
          <p><strong>Status:</strong> Active</p>
          <p><strong>Last Login:</strong> Just now</p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
