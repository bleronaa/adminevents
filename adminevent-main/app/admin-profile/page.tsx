"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LogOut,
  UserCircle,
  Mail,
  Shield,
  Clock,
  Activity,
  Settings,
  Bell,
  Key,
  Users,
  ChevronUp,
  BarChart3,
  Calendar
} from "lucide-react";

export default function AdminProfile() {
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
            <div className="relative flex items-center gap-8">
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg ring-1 ring-white/20">
                <UserCircle className="w-24 h-24 text-blue-600" />
              </div>
              <div className="text-white">
                <h2 className="text-4xl font-bold tracking-tight">Admin Dashboard</h2>
                <div className="flex items-center mt-3 space-x-3">
                  <Mail className="w-5 h-5 text-blue-200" />
                  <p className="text-lg text-blue-100 font-medium">{adminEmail || "Loading..."}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">
            {[
              { icon: Users, label: "Total Users", value: "1,234", trend: "+12%", color: "blue" },
              { icon: Activity, label: "System Status", value: "99.9%", trend: "+0.5%", color: "green" },
              { icon: BarChart3, label: "Weekly Growth", value: "+28%", trend: "+5%", color: "purple" },
              { icon: Calendar, label: "Last Login", value: "Just Now", trend: "", color: "indigo" }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
                <div className={`inline-flex p-3 rounded-xl bg-${stat.color}-50`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <p className="mt-4 text-sm font-medium text-gray-600">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.trend && (
                    <span className="flex items-center text-sm font-medium text-green-600">
                      <ChevronUp className="w-4 h-4" />
                      {stat.trend}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Shield className="w-6 h-6 text-blue-600" />
              Security Details
            </h3>
            <div className="space-y-5">
              {[
                { icon: Key, label: "Role", value: "Administrator", color: "blue" },
                { icon: Settings, label: "Permissions", value: "Full Access", color: "indigo" },
                { icon: Bell, label: "Notifications", value: "Enabled", color: "purple" }
              ].map((detail, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className={`p-3 rounded-xl bg-${detail.color}-50`}>
                    <detail.icon className={`w-6 h-6 text-${detail.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{detail.label}</p>
                    <p className="text-lg font-semibold text-gray-900">{detail.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
            <div className="space-y-5">
              {[
                { time: "2 minutes ago", action: "System backup completed", status: "success" },
                { time: "1 hour ago", action: "User permissions updated", status: "warning" },
                { time: "3 hours ago", action: "New user account created", status: "info" },
                { time: "5 hours ago", action: "Security audit completed", status: "success" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}