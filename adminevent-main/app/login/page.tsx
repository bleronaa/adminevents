"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Merre URL-në nga .env
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Dergo POST request te backend-i për login
      const response = await axios.post(`${baseUrl}/api/auth/admin-login`, {
        email,
        password,
      });

      // Nëse login-i është i suksesshëm
      if (response.status === 200) {
        const { user, token } = response.data;

        // Verifiko nëse përdoruesi është admin i lejuar
        const allowedAdmins = [
          "blerona.tmava@umib.net",
          "habibtmava06@gmail.com",
        ];

        if (!allowedAdmins.includes(user.email)) {
          setError("Access denied! Only admins are allowed.");
          return;
        }

        // Ruaj token në localStorage
        localStorage.setItem("token", token);

        // Redirekto në dashboard ose faqen kryesore
        router.push("/");
      }
    } catch (err: any) {
      // Nëse ka error nga backend, shfaq mesazhin
      const message =
        err?.response?.data?.error ||
        err?.message ||
        "Invalid credentials or login failed.";
      setError(message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
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
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
