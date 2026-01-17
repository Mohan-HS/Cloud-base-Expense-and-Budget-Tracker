"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await apiRequest<{ token: string }>(
        "/api/auth/login",
        "POST",
        form
      );

      localStorage.setItem("token", res.token);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Something went wrong");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Login</button>
    </form>
  );
}
