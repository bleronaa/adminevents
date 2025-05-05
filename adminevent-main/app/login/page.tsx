"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Shto gjendje loading

  // Sigurohu që baseUrl është vendosur
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) {
    console.error("NEXT_PUBLIC_API_BASE_URL is not defined");
    setError("Configuration error. Please contact support.");
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        `${baseUrl}/api/auth/admin-login`,
        { email, password },
        { withCredentials: true } // Mbështet kredenciale
      );

      if (response.status === 200) {
        const user = response.data.user;

        // Lista e adminëve të lejuar
        const allowedAdmins = [
          "blerona.tmava@umib.net",
          "habibtmava06@gmail.com",
        ];

        if (!allowedAdmins.includes(user.email)) {
          setError("Access denied! Only admins are allowed.");
          return;
        }

        // Ruaj token-in në localStorage
        localStorage.setItem("token", response.data.token);
        router.push("/"); // Ridrejtimi pas login-it
      }
    } catch (err) {
      // Trajto error-et nga Axios
      if (err instanceof AxiosError) {
        const message = err.response?.data?.error || "Invalid credentials or login failed.";
        setError(message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">Admin Login</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}