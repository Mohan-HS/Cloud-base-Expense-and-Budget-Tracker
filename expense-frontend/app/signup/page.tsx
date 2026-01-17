"use client";

import { useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiRequest("/api/auth/signup", "POST", form);

      // Redirect to login page after successful signup
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md">
        <div className="border border-gray-700 rounded-lg p-8 bg-black">
          <h1 className="text-3xl font-semibold mb-2 text-center">Sign Up</h1>
          <p className="text-gray-400 text-center mb-6">
            Create an account to start tracking your expenses
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-600 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-gray-600 bg-black p-3 w-full rounded text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-gray-600 bg-black p-3 w-full rounded text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-gray-600 bg-black p-3 w-full rounded text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black px-4 py-3 rounded font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-white hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
