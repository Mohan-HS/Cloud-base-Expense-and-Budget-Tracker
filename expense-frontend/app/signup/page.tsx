"use client";

import { useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await apiRequest<{ token: string }>(
        "/api/auth/signup",
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
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
